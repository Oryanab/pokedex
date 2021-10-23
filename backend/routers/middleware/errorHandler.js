const express = require("express");
const userHandlerRouter = express.Router();
const fs = require("fs");
const path = require("path");
// ///
// userHandlerRouter.use((req, res, next) => {
//   // chrome only work with this headers !
//   res.append("Access-Control-Allow-Origin", ["*"]);
//   res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.append("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });
// userHandlerRouter.use(express.json());
// ///

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
  if (!usersJsonData[req.body.username].includes(parseInt(req.params.id))) {
    next();
  } else {
    res.sendStatus(403);
    //Cannot set headers after they are sent to the client
  }
}

function middleWareDelete(req, res, next) {
  let usersJsonData = returnUserJsonData();
  if (usersJsonData[req.body.username].includes(parseInt(req.params.id))) {
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = { middleWarePokemonGet, middleWarePut, middleWareDelete };
