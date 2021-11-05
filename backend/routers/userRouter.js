"use strict";

const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

/*
  Get json data
*/
function returnUserJsonData() {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  return usersJsonData;
}

router.get("/:username", (req, res) => {
  let usersJsonData = returnUserJsonData();
  if (Object.keys(usersJsonData).includes(req.params.username)) {
    res.json(usersJsonData[req.params.username]);
  } else {
    res.sendStatus(401);
  }
});

router.post("/:username/info", (req, res) => {
  let usersJsonData = returnUserJsonData();
  if (Object.keys(usersJsonData).includes(req.params.username)) {
    res.json({ username: req.body.username });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

router.post("/signup", (req, res) => {
  let usersJsonData = returnUserJsonData();
  if (!Object.keys(usersJsonData).includes(req.headers.username)) {
    usersJsonData[req.headers.username] = [];
    fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
    res.json(usersJsonData);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
