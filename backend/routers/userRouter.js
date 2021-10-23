"use strict";

const express = require("express");
const router = express.Router();

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
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;

// /*
//     catch pokemons section:
// */
// function checkIfUserExist(dirname) {
//     if (!fs.existsSync(`./user/${dirname}`)) {
//       fs.mkdirSync(dirname, { recursive: true });
//       return true;
//     } else {
//       return false;
//     }
//   }

//   function checkIfPokemonExist(dirname, pokemonId) {
//     if (!fs.existsSync(`./user/${dirname}/${pokemonId}`)) {
//       fs.writeFileSync(
//         `./user/${dirname}/${pokemonId}.json`,
//         JSON.stringify({
//           pokemon: pokemonId,
//         })
//       );
//       return true;
//     } else {
//       return false;
//     }
//   }
//   /*
//       catch pokemons END
//   */
