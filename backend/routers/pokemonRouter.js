"use strict";
const express = require("express");
const router = express.Router();

const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();

const fs = require("fs");
const path = require("path");

router.use((req, res, next) => {
  // chrome only work with this headers !
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
router.use(express.json());

/*
    catch pokemons section:
*/

// check if user exist if it will return True
function checkIfUserExist(usersJsonData, username) {
  for (let user of Object.keys(usersJsonData)) {
    if (username === user) {
      return true;
    } else {
      return false;
    }
  }
}
// check if the pokemon exist it will return True
function checkIfPokemonExist(usersJsonData, username, pokemonId) {
  for (let pokemon of usersJsonData[username]) {
    if (pokemon === pokemonId) {
      return true;
    } else {
      return false;
    }
  }
}

/*
    catch pokemons END
*/
router.get("/", (req, res) => {
  res.send("welcome");
});

router.put("/catch/:id", (req, res) => {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  const existingPokemons = [];
  for (let pokemon of usersJsonData[req.body.username]) {
    existingPokemons.push(pokemon);
  }
  usersJsonData[req.body.username] = [];
  usersJsonData[req.body.username].push(parseInt(req.params.id));
  for (let pokemon of existingPokemons) {
    if (!usersJsonData[req.body.username].includes(pokemon)) {
      usersJsonData[req.body.username].push(pokemon);
    } else {
      res.sendStatus(403);
    }
  }
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  res.json(usersJsonData);
});

router.delete("/release/:id", (req, res) => {
  let allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());

  for (let pokemon of usersJsonData[req.body.username]) {
    if (pokemon === parseInt(req.params.id)) {
      usersJsonData[req.body.username].splice(
        usersJsonData[req.body.username].indexOf(pokemon),
        1
      );
    } else {
      res.sendStatus(403);
    }
  }
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  res.json(usersJsonData);
});

router.get("/users/:username", (req, res) => {
  const allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  let usersJsonData = JSON.parse(allUsersFile.toString());
  Object.keys(usersJsonData).forEach((user) => {
    if (user === req.params.username) {
      res.json(usersJsonData[user]);
    }
  });
});

// get query pokemon response
router.get("/:name", (req, res) => {
  P.getPokemonByName(req.params.name)
    .then(function (response) {
      res.json({
        name: response.name,
        id: response.id,
        height: response.height,
        weight: response.weight,
        types: response.types,
        front_pic: response.sprites.front_default,
        back_pic: response.sprites.back_default,
        abilities: response.abilities,
      });
    })
    .catch(function (error) {
      res.json({ Error: "There was an ERROR" });
    });
});

// get response id
router.get("/get/:id", (req, res) => {
  res.send(`hello ${req.params.id}`);
});

module.exports = router;
