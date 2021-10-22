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
  const allUsersFile = fs.readFileSync(
    path.resolve(__dirname, "../../user.json")
  );
  res.send(JSON.parse(allUsersFile.toString()));
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
  usersJsonData[req.body.username].push(req.body.id);
  for (let pokemon of existingPokemons) {
    if (!usersJsonData[req.body.username].includes(pokemon)) {
      usersJsonData[req.body.username].push(pokemon);
    }
  }
  fs.writeFileSync("user.json", Buffer.from(JSON.stringify(usersJsonData)));
  res.json(usersJsonData);

  //   if (!checkIfUserExist(usersJsonData, req.body.username)) {
  //     // need to create new user and push the id of the pokemon
  //     usersJsonData[req.body.username] = [];
  //     usersJsonData[req.body.username].push(req.body.id);
  //     fs.writeFileSync("./users.json", JSON.stringify(usersJsonData));
  //     res.json(usersJsonData);
  //   } else if (
  //     checkIfUserExist(usersJsonData, req.body.username) &&
  //     !checkIfPokemonExist(usersJsonData, req.body.username, req.params.id)
  //   ) {
  //     // need to push the id of the pokemon
  //     usersJsonData[req.body.username].push(req.body.id);
  //     fs.writeFileSync("./users.json", JSON.stringify(usersJsonData));
  //     res.json(usersJsonData);
  //   } else {
  //     res.json({ status: "Already caught" });
  //   }
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
