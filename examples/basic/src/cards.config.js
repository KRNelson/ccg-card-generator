import fs from 'fs';
import { parse } from 'csv-parse/sync';

const server = `http://localhost:3000/images`;

const fileData = fs.readFileSync('./src/cards.csv')

const cards = parse(fileData, {columns: true, trim: true, delimiter: ','})
				.map((row) => {
					return { name: `**${row.Name}**`
						   , image: `![${row.Name}](${server}/${row.Image})`
					};
				})

module.exports = {cards};