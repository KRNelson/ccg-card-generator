import express from "express";

const folder = "public";
const port = 3000;
const app = express();
app.use(express.static(`${process.cwd()}/src/${folder}`));
app.listen(port);
