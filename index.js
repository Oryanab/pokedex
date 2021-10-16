"use strict";

// get the pokemon json data:
async function searchPokemon(pokemonName) {
  let getPokemonJson = `https://murmuring-cove-95500.herokuapp.com/api/pokemon/${pokemonName}`;
  try {
    const pokemonJsonData = await axios.get(getPokemonJson);
    lunchSuccessMessageBox();
    return pokemonJsonData["data"];
  } catch (e) {
    lunchErrorMessageBox();
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
      try {
        const getRelatedPokemon = await axios.get(
          `https://murmuring-cove-95500.herokuapp.com/api/type/${e.currentTarget.textContent}`
        );

        if (!document.getElementById("related-pokemon")) {
          generatedRelatedPokemon(getRelatedPokemon);
        } else {
          document.getElementById("related-pokemon").remove();
        }
        lunchSuccessReturnTypes();
      } catch (e) {
        lunchErrorMessageBox();
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

  if (searchBox.value.length < 1) {
    lunchBadInputMessageBox();
  } else {
    createDomFromApi(searchBox.value);
  }
  searchBox.value = "";
});

function createSuccessMssage(
  messageColor,
  messageTitle,
  message,
  emoji,
  divbackground
) {
  const successMssageBox = document.createElement("div");
  successMssageBox.classList.add("popup");
  successMssageBox.classList.add("center");
  const icon = document.createElement("div");
  icon.classList.add("icon");
  const iconEmoji = document.createElement("i");
  iconEmoji.textContent = emoji;
  iconEmoji.classList.add("fa");
  iconEmoji.classList.add("fa-check");
  icon.appendChild(iconEmoji);
  successMssageBox.appendChild(icon);
  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = messageTitle; // success/ Error
  title.style.color = messageColor;
  successMssageBox.appendChild(title);
  const description = document.createElement("div");
  description.classList.add("description");
  description.textContent = message; // enter the message
  successMssageBox.appendChild(description);
  const dismissBtn = document.createElement("div");
  dismissBtn.classList.add("dismiss-btn");
  const dismissPopupBtn = document.createElement("button");
  dismissPopupBtn.setAttribute("id", "dismiss-popup-btn");
  dismissPopupBtn.textContent = "Dismiss";
  dismissPopupBtn.addEventListener("click", RemoveSuccessMssage);
  dismissBtn.appendChild(dismissPopupBtn);
  successMssageBox.appendChild(dismissBtn);
  successMssageBox.setAttribute("id", "successMssageBox");
  successMssageBox.style.zIndex = 200;
  successMssageBox.style.backgroundColor = divbackground;
  const body = document.body;
  body.append(successMssageBox);
}

function RemoveSuccessMssage() {
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.remove();
}

function lunchErrorMessageBox() {
  createSuccessMssage(
    "red",
    "Error",
    "We are sorry, the Pokemon you've searched is not exist",
    "❌",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchBadInputMessageBox() {
  createSuccessMssage("red", "Error", "Must Insert a Name", "❌", "white");
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchSuccessMessageBox() {
  createSuccessMssage(
    "green",
    "Success",
    "Check Out Your Selected Pokemon!",
    "✔️",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchSuccessReturnTypes() {
  createSuccessMssage(
    "green",
    "Success",
    "Check Out All Related Pokemons! Lets Go Pokemon!!!",
    "✔️",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}
