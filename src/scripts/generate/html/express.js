import express from 'express';
import path from 'path';
import { marked } from 'marked';
import compileSass from 'compile-sass';
import sass from 'sass';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const folder = process.env.FOLDER || 'public';
const ejs = process.env.EJS || 'views';
const port = process.env.PORT || 3000;
const csv = process.env.CVS || './src/person.csv';
const images = process.env.IMAGES || './public/images'

const app = express();

/* Person */
const pageDimensions = {
    height: 350,
    width: 300,
    padding: 5,
  }

const cardDimensions = {
    height: 160,
    width: 95,
    margin: 5,
    border: 2,
  }

/* Statuettes 
const pageDimensions = {
    height: 325,
    width: 250,
    padding: 5,
  }

const cardDimensions = {
    height: 135,
    width: 68,
    margin: 5,
    border: 0,
  }

*/


/* Rock/Paper/Scissors 
const pageDimensions = {
    height: 250,
    width: 300,
    padding: 5,
  }

const cardDimensions = {
    height: 106,
    width: 81,
    margin: 0,
    border: 0,
  }
*/


const node_modules = '../../../../node_modules/';
app.use(express.static(path.join(node_modules, 'jquery/dist/')));
app.use(express.static(path.join(node_modules, 'bootstrap/dist/js/')));
app.use(express.static(path.join(node_modules, 'bootstrap/dist/css/')));

app.use(express.static(path.join(process.cwd(), images)));

app.use('/css/:cssName', compileSass.setup({
    sassFilePath: path.join(process.cwd(), 'public/scss')
    , sassFileExt: 'scss'
    , embedSrcMapInProd: true
    , resolveTildes: true
    , sassOptions: {
        alertAscii: true
        , verbose: true
        , functions: {
            'card-height()': function() {
                return new sass.SassNumber(cardDimensions.height, 'mm');
            },
            'card-width()': function() {
                return new sass.SassNumber(cardDimensions.width, 'mm');
            },
            'card-margin()': function() {
                return new sass.SassNumber(cardDimensions.margin, 'mm');
            },
            'card-border()': function() {
                return new sass.SassNumber(cardDimensions.border, 'px');
            },
            'page-height()': () => {
                return new sass.SassNumber(pageDimensions.height, 'mm');
            },
            'page-width()': () => {
                return new sass.SassNumber(pageDimensions.width, 'mm');
            },
            'page-max-height()': () => {
                return new sass.SassNumber(pageDimensions.height, 'mm');
            },
            'page-max-width()': () => {
                return new sass.SassNumber(pageDimensions.width, 'mm');
            },
            'page-max-padding()': () => {
                return new sass.SassNumber(pageDimensions.padding, 'mm');
            }
        }
    }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), ejs))

const router = express.Router();

const fileData = fs.readFileSync(csv)

const cards = parse(fileData, {columns: true, trim: true, delimiter: ','});

const getCardsPerPage = (dimensions) => {
    const cardsPerRow = Math.floor(
      (dimensions.page.width - dimensions.page.padding * 2) /
        (dimensions.card.width + dimensions.card.margin + dimensions.card.border),
    );
  
    const cardsPerColumn = Math.floor(
      (dimensions.page.height - dimensions.page.padding * 2) /
        (dimensions.card.height +
          dimensions.card.margin +
          dimensions.card.border),
    );

    console.log("getCardsPerPage", cardsPerRow, cardsPerColumn)
  
    return cardsPerRow * cardsPerColumn;
  };

const cardsPerPage = getCardsPerPage({page: pageDimensions, card: cardDimensions});
const totalPages = Math.ceil(cards.length / cardsPerPage);

console.log("cardsPerPage", cardsPerPage);
console.log("totalPages", totalPages);

let cardPages = Array(totalPages)
    .fill("")
    .map((_) => []);

cards.forEach((card, i) => {
    const page = Math.floor(i / cardsPerPage);
    cardPages[page].push(card);
});

cardPages = cardPages.map(page => page.map(card => {
    return Object
            .keys(card)
            .reduce((obj, key) => {
                obj[key.toLowerCase()] = marked.parse(String(card[key]));
                obj[`${key.toLowerCase()}_raw`] = String(card[key]);
                return obj;
            }, {})
}));

router.get('/', (req, res, next) => {
    res.render('html', {cardPages});
});

app.use(router);

export const server = app.listen(port, () => {
    console.log("Listening to port", port);
});
