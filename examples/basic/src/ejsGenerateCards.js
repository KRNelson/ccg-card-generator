import ejs from 'ejs';
import fs from 'fs';

const template = fs.readFileSync('./src/ejs/card.ejs', 'utf-8'); 


const generateHtmlBody = (dimensions, cardPages) => {
    console.log("Template", template);
    return ejs.render(template, {dimensions, cardPages});
}
  
export default generateHtmlBody