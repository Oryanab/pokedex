const express = require("express");
const userHandlerRouter = express.Router();
const fs = require("fs");
const path = require("path");

function returnUserJsonData() {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  return usersJsonData;
}

function middleWarePokemonGet(err, req, res, next) {
  res.sendStatus(404);
}

function middleWarePut(req, res, next) {
  let usersJsonData = returnUserJsonData();
  if (!usersJsonData[req.body.username].includes(parseInt(req.body.id))) {
    next();
  } else {
    res.sendStatus(403);
    //Cannot set headers after they are sent to the client
  }
}

function middleWareDelete(req, res, next) {
  let usersJsonData = returnUserJsonData();
  if (usersJsonData[req.body.username].includes(parseInt(req.body.id))) {
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = { middleWarePokemonGet, middleWarePut, middleWareDelete };
