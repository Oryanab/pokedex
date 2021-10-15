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
    console.log(pokemonJsonData["data"]);
    return pokemonJsonData["data"];
  } catch (e) {
    throw e;
  }
}
searchPokemon("ditto");

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
createDomFromApi("bulbasaur");

/*
  createDomPokemonTypes: Create the Types Section
*/
async function createDomPokemonTypes(json) {
  const pokemonTypes = document.querySelector("#pokemon-types");
  const pokemonJsonData = await json;
  for (let type of pokemonJsonData["types"]) {
    const newType = document.createElement("p");
    const spanArrow = document.createElement("span");
    const typeRelatedUl = document.createElement("ul");
    typeRelatedUl.setAttribute("id", "related-pokemon");

    spanArrow.setAttribute("id", "span-arrow");
    spanArrow.textContent = " ▶";
    newType.textContent = type;
    newType.addEventListener("click", async (e) => {
      const getRelatedPokemon = await axios.get(
        `https://murmuring-cove-95500.herokuapp.com/api/type/${newType.textContent}`
      );

      generatedRelatedPokemon(getRelatedPokemon);
    });

    pokemonTypes.appendChild(newType);
    newType.appendChild(typeRelatedUl);
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
  const relatedPokemon = document.querySelector("#related-pokemon");
  const returnJson = await json;
  const allResults = returnJson["data"]["pokemons"];
  for (let pokemon in allResults) {
    console.log(allResults[pokemon].name);
    const newParagraph = document.createElement("p");
    newParagraph.textContent = allResults[pokemon].name;
    relatedPokemon.appendChild(newParagraph);
  }
}

// button.addEventListener("click", (e) => {
//   if (button.textContent === "▶") {
//     button.textContent = "▼";
//     ul.style.display = "block";
//   } else {
//     button.textContent = "▶";
//     ul.style.display = "none";
//   }

{
  /* <p>Types:<ul id ='pokemon-types'></ul></p> */
}
