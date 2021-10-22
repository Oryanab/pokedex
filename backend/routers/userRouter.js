"use strict";

const express = require("express");
const router = express.Router();

const fs = require("fs");

router.get("/:username", (req, res) => {
  const allUsersPokemons = [];
  if (!createDir(req.params.username)) {
    try {
      fs.readdir(`./user/${req.params.username}`, (err, files) => {
        files.forEach((file) => {
          allUsersPokemons.push(file);
        });
      });
      res.json({ "caught pokemons": allUsersPokemons });
    } catch (e) {
      res.json({ error: "user not found" });
    }
  } else {
    res.json({ error: "user not found" });
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
