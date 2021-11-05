const express = require("express");
const userHandlerRouter = express.Router();
const fs = require("fs");
const path = require("path");
/////
userHandlerRouter.use((req, res, next) => {
  // chrome only work with this headers !
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
userHandlerRouter.use(express.json());
///////

function returnUserJsonData() {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  return usersJsonData;
}

function ifUSerExist(req, res, next) {
  let usersJsonData = returnUserJsonData();
  if (!req.headers.username) {
    res.sendStatus(401);
  } else if (
    req.headers.username &&
    !Object.keys(usersJsonData).includes(req.headers.username)
  ) {
    usersJsonData[req.body.username] = [];
  }
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  next();
}

module.exports = ifUSerExist;
