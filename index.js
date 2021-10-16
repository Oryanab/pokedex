"use strict";

/*
code plan:
- when user click "check my pokemon"
- 2 get request are sent:
- getPokemon: https://murmuring-cove-95500.herokuapp.com/api/pokemon/{name}
- Dom: generate: name, height, weight, types(array), image front, btn-catch status
- Events: 
- image-mouse-in-out = show image back
- pokemon catch status (get) = https://murmuring-cove-95500.herokuapp.com/api/collection/status/{pokmonId}
- catch pokemon (post) = https://murmuring-cove-95500.herokuapp.com/api/collection/catch (post json from getPokemon)
- release pokemon (delete) = https://murmuring-cove-95500.herokuapp.com/api/collection/release/{pokmonId}

*/

// get the pokemon json data:
async function searchPokemon(pokemonName) {
  let getPokemonJson = `https://murmuring-cove-95500.herokuapp.com/api/pokemon/${pokemonName}`;
  try {
    const pokemonJsonData = await axios.get(getPokemonJson);
    return pokemonJsonData["data"];
  } catch (e) {
    throw e;
  }
}

// get all parameters and write all in html this will happen on Click
async function createDomFromApi(pokemon) {
  // receive all the data about the pokemon
  const pokemonJsonData = await searchPokemon(pokemon);
  // select all html result div elements
  const pokemonName = document.querySelector("#pokemon-name");
  const pokemonHeight = document.querySelector("#pokemon-height");
  const pokemonWeight = document.querySelector("#pokemon-weight");

  // change the values to the pokemon details
  pokemonName.textContent = pokemonJsonData["name"];
  pokemonHeight.textContent = pokemonJsonData["height"];
  pokemonWeight.textContent = pokemonJsonData["weight"];

  createDomPokemonTypes(pokemonJsonData);
  createDomPokemonImg(pokemonJsonData);
}
//  bulbasaur
// createDomFromApi("pidgey");

/*
  createDomPokemonTypes: Create the Types Section
*/
async function createDomPokemonTypes(json) {
  const pokemonTypes = document.querySelector("#pokemon-types");
  pokemonTypes.innerHTML = "";
  const pokemonJsonData = await json;
  for (let type of pokemonJsonData["types"]) {
    const newType = document.createElement("p");
    newType.textContent = type;
    newType.addEventListener("click", async (e) => {
      const getRelatedPokemon = await axios.get(
        `https://murmuring-cove-95500.herokuapp.com/api/type/${e.currentTarget.textContent}`
      );

      if (!document.getElementById("related-pokemon")) {
        generatedRelatedPokemon(getRelatedPokemon);
      } else {
        document.getElementById("related-pokemon").remove();
      }
    });

    pokemonTypes.appendChild(newType);
  }
}

/*
  createDomPokemonImg: Create the image Section
*/
async function createDomPokemonImg(json) {
  const pokemonImg = document.querySelector("#poke-image");
  const pokemonJsonData = await json;
  // img functionality
  pokemonImg.setAttribute("src", pokemonJsonData["sprites"]["front_default"]);
  pokemonImg.addEventListener("mouseover", (e) => {
    return (e.currentTarget.src = "".concat(
      pokemonJsonData["sprites"]["back_default"]
    ));
  });
  pokemonImg.addEventListener("mouseout", (e) => {
    return (e.currentTarget.src = "".concat(
      pokemonJsonData["sprites"]["front_default"]
    ));
  });
}

async function generatedRelatedPokemon(json) {
  const resultDiv = document.querySelector("#result-div");
  const relatedPokemon = document.createElement("p");
  relatedPokemon.setAttribute("id", "related-pokemon");
  relatedPokemon.textContent = ``;
  const relatedPokemonUl = document.createElement("ul");

  const returnJson = await json;
  relatedPokemon.textContent = `Type: ${returnJson.data.name} Related Pokemon:`;
  const allResults = returnJson["data"]["pokemons"];
  for (let pokemon in allResults) {
    const newParagraph = document.createElement("p");
    newParagraph.textContent = allResults[pokemon].name;
    newParagraph.addEventListener("click", async (e) => {
      document.getElementById("related-pokemon").remove();
      createDomFromApi(e.currentTarget.textContent);
    });
    relatedPokemonUl.appendChild(newParagraph);
  }

  relatedPokemon.appendChild(relatedPokemonUl);
  resultDiv.appendChild(relatedPokemon);
}

document.getElementById("btn").addEventListener("click", async (e) => {
  const searchBox = document.getElementById("textarea");
  try {
    document.getElementById("related-pokemon").remove();
  } catch (e) {}

  createDomFromApi(searchBox.value);
  searchBox.value = "";
});
