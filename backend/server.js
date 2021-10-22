"use strict";

const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

app.use((req, res, next) => {
  // chrome only work with this headers !
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// route our app
app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use(express.json());

const pokemonRouter = require("./routers/pokemonRouter");
app.use("/pokemon", pokemonRouter);

const userRouter = require("./routers/userRouter");
app.use("/users", userRouter);

// start the server
app.listen(port);
