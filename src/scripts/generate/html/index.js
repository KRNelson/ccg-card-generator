import _ from "lodash";
import fs from "fs";

import createHtmlPages from "./createHtmlPages";

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

  return cardsPerRow * cardsPerColumn;
};

const generateHTML = (
  cards,
  styles,
  dimensions,
  htmlGenerator = createHtmlPages,
) => {
  const cardsPerPage = getCardsPerPage(dimensions);
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  let cardPages = Array(totalPages)
    .fill("")
    .map((x) => []);

  cards.forEach((card, i) => {
    const page = Math.floor(i / cardsPerPage);
    cardPages[page].push(card);
  });

  /*
  const css = fs.readFileSync(styles, function (err) {
    if (err) console.log(err);
  });
  */

  const css_links = fs.readdirSync(`${process.cwd()}/src/public/css`);

  return `
    <html>
      <head>
          ${css_links.map(css => `<link type='text/css' rel='stylesheet' href='http://localhost:3000/css/${css}'>`).join('\n')}
        <style>
          @page {
            size: ${dimensions.page.width}mm ${dimensions.page.height}mm;
          }
        </style>
      </head>
      
      ${htmlGenerator(dimensions, cardPages)}
    </html>
  `;
};

export default generateHTML;
