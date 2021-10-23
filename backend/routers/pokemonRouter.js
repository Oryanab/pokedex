"use strict";
const express = require("express");
const router = express.Router();

const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();

const fs = require("fs");
const path = require("path");

const isUserExist = require("./middleware/userHandler.js");
const errorHandler = require("./middleware/errorHandler.js");

// router.use();
router.use((req, res, next) => {
  // chrome only work with this headers !
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
router.use(express.json());

/*
    get pokemon data search by query
*/
const middleWarePokemonGet = errorHandler.middleWarePokemonGet;
router.get("/:name", (req, res) => {
  P.getPokemonByName(req.params.name)
    .then(function (response) {
      let types = [];
      response.types.forEach((type) => {
        types.push(type.type.name);
      });
      let abilities = [];
      response.abilities.forEach((ability) => {
        abilities.push(ability.ability.name);
      });
      res.json({
        name: response.name,
        id: response.id,
        height: response.height,
        weight: response.weight,
        types: types,
        sprites: {
          front_default: response.sprites.front_default,
          back_default: response.sprites.back_default,
        },
        abilities: abilities,
      });
    })
    .catch((err) => {
      middleWarePokemonGet(err, req, res);
    });
});

/*
    get pokemon data search by id
*/
router.get("/get/:id", (req, res) => {
  P.getPokemonByName(req.params.id)
    .then(function (response) {
      let types = [];
      response.types.forEach((type) => {
        types.push(type.type.name);
      });
      let abilities = [];
      response.abilities.forEach((ability) => {
        abilities.push(ability.ability.name);
      });
      res.json({
        name: response.name,
        id: response.id,
        height: response.height,
        weight: response.weight,
        types: types,
        sprites: {
          front_default: response.sprites.front_default,
          back_default: response.sprites.back_default,
        },
        abilities: abilities,
      });
    })
    .catch((err) => {
      middleWarePokemonGet(err, req, res);
    });
});

/*
    user confirmation
*/
router.use(isUserExist);
const middleWarePut = errorHandler.middleWarePut;
const middleWareDelete = errorHandler.middleWareDelete;

/*
   general functions:
*/
function returnUserJsonData() {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  return usersJsonData;
}
/*
    pokemon home page
*/
router.get("/", (req, res) => {
  res.send("welcome");
});

/*
    Catch Pokemon
*/

//const middleWarePutSec = require("./middleware/errorHandler.js");
// function middleWarePut(req, res, next) {
//   let usersJsonData = returnUserJsonData();
//   if (!usersJsonData[req.body.username].includes(parseInt(req.params.id))) {
//     next();
//   } else {
//     res.sendStatus(403);
//     //Cannot set headers after they are sent to the client
//   }
// }
//const middleWarePutSec = require("./middleware/errorHandler.js");
router.put("/catch/:id", middleWarePut, (req, res) => {
  let usersJsonData = returnUserJsonData();
  usersJsonData[req.body.username].push(parseInt(req.params.id));
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  res.json(usersJsonData);
});

/*
   Release pokemon
*/
router.delete("/release/:id", middleWareDelete, (req, res) => {
  let usersJsonData = returnUserJsonData();
  //   if (usersJsonData[req.body.username].includes(parseInt(req.params.id))) {
  usersJsonData[req.body.username].splice(
    usersJsonData[req.body.username].indexOf(parseInt(req.params.id)),
    1
  );
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  res.json(usersJsonData);
});

module.exports = router;
