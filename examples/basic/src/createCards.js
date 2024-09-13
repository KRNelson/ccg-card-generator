import input from "./cards.config";
import generateCards from "ccg-card-generator";
import generator from "./ejsGenerateCards.js"

const options = {
  debug: true,
  destination: "./cards.pdf",
  htmlGenerator: generator
};

generateCards(input.cards, options);