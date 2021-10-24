"use strict";

const express = require("express");
const pokemonRouter = require("./routers/pokemonRouter");
const userRouter = require("./routers/userRouter");
const cors = require("cors");
const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());
app.use("/pokemon", pokemonRouter);
app.use("/users", userRouter);
app.listen(port);
