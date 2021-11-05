"use strict";

// get the pokemon json data:
async function searchPokemon(pokemonName) {
  let getPokemonJson = `http://localhost:8080/pokemon/${pokemonName}`;
  try {
    const pokemonJsonData = await axios.get(getPokemonJson);
    return pokemonJsonData["data"];
  } catch (e) {
    lunchErrorMessageBox();
  }
}

async function signUpUser(userName) {
  let userSignUpUrl = "http://localhost:8080/users/signup";
  try {
    const confirmSignUp = await axios({
      method: "post",
      url: userSignUpUrl,
      body: {
        username: userName,
      },
      headers: {
        "Content-Type": "application/json",
        username: userName,
      },
    });
    lunchSuccessSignUp();
  } catch (e) {
    lunchUserAlreadyExist();
  }
}

//const userName = document.querySelector("#username").value;
async function userAuth(userName) {
  let userAuth = `http://localhost:8080/users/${userName}/info`;
  try {
    const checkUserData = await axios({
      method: "post",
      url: userAuth,
      body: {
        username: userName,
      },
      headers: { "Content-Type": "application/json" },
    });
    return checkUserData.status;
  } catch (e) {
    return e;
  }
}

document.querySelector("#btn-signup").addEventListener("click", async (e) => {
  e.preventDefault();
  const newUserName = document.querySelector("#sign-up-area").value;
  return await signUpUser(newUserName);
});

// get all parameters and write all in html this will happen on Click
async function createDomFromApi(pokemon) {
  // receive all the data about the pokemon
  const pokemonJsonData = await searchPokemon(pokemon);
  // select all html result div elements
  const pokemonName = document.querySelector("#pokemon-name");
  const pokemonId = document.querySelector("#pokemon-id");
  const pokemonHeight = document.querySelector("#pokemon-height");
  const pokemonWeight = document.querySelector("#pokemon-weight");
  const username = document.querySelector("#username").value;
  const titleResults = document.querySelector("#title-results");
  if ((await userAuth(username)) === 200) {
    lunchSuccessMessageBox();
    titleResults.textContent = `Hello ${username}:`;
    // change the values to the pokemon details
    pokemonName.textContent = pokemonJsonData.name;
    pokemonId.textContent = pokemonJsonData.id;
    pokemonHeight.textContent = pokemonJsonData.height;
    pokemonWeight.textContent = pokemonJsonData.weight;
    createDomPokemonTypes(pokemonJsonData);
    createDomPokemonImg(pokemonJsonData);
  } else {
    lunchUserHasToSignUp();
  }
}

/*
  catch button functionality
*/
document.querySelector("#catch").addEventListener("click", async (e) => {
  const userName = document.querySelector("#username").value;
  const pokemonID = document.querySelector("#pokemon-id").textContent;
  let putRequestCatchPokemon = `http://localhost:8080/pokemon/catch/${pokemonID}`;
  try {
    const requestCatchPokemon = await axios({
      method: "PUT",
      url: putRequestCatchPokemon,
      data: {
        username: userName,
        id: pokemonID,
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        username: userName,
      },
    });
    lunchPokemonSuccessCaught();
  } catch (e) {
    lunchPokemonAlreadyCaught();
  }
});

/*
  release button functionality
*/
document.querySelector("#release").addEventListener("click", async (e) => {
  const userName = document.querySelector("#username").value;
  const pokemonID = document.querySelector("#pokemon-id").textContent;
  let putRequestDeletePokemon = `http://localhost:8080/pokemon/release/${pokemonID}`;
  try {
    const requestDeletePokemon = await axios({
      method: "DELETE",
      url: putRequestDeletePokemon,
      data: {
        username: userName,
        id: pokemonID,
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        username: userName,
      },
    });

    lunchPokemonSuccessReleased();
  } catch (e) {
    lunchPokemonCantBeReleased();
  }
});

/*
  create caught pokemons 
*/

document.querySelector("#my-pokemon").addEventListener("click", async (e) => {
  const username = document.querySelector("#username").value;
  try {
    const userCaughtPokemons = await axios.get(
      `http://localhost:8080/users/${username}`
    );
    let allPokemons = "";
    for (let pokemon of userCaughtPokemons.data) {
      const { name } = await searchPokemon(pokemon);
      allPokemons += name + ", ";
    }
    function lunchAllPokemons() {
      createSuccessMssage(
        "red",
        "MY POKEMONS",
        `check out your pokemons: ${allPokemons}`,
        "🥎",
        "white"
      );
      const successMssageBox = document.getElementById("successMssageBox");
      successMssageBox.classList.add("active");
    }
    lunchAllPokemons();
  } catch (e) {
    console.log("user not found");
  }
});

/*
  createDomPokemonTypes: Create the Types Section
*/
async function createDomPokemonTypes(types) {
  const pokemonTypes = document.querySelector("#pokemon-types");
  pokemonTypes.innerHTML = "";
  const pokemonJsonData = await types;
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
  e.preventDefault();
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

// user exist
function lunchUserAlreadyExist() {
  createSuccessMssage("red", "Error", "User Already Exist", "❌", "white");
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchUserHasToSignUp() {
  createSuccessMssage("red", "Error", "User Has To Sign Up!", "❌", "white");
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchSuccessSignUp() {
  createSuccessMssage(
    "green",
    "Success",
    "user Sign Up Successfully",
    "✔️",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchPokemonAlreadyCaught() {
  createSuccessMssage("red", "Error", "Pokemon Already Caught", "❌", "white");
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchPokemonSuccessCaught() {
  createSuccessMssage(
    "green",
    "Success",
    "Pokemon Caught successfully",
    "✔️",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchPokemonCantBeReleased() {
  createSuccessMssage(
    "red",
    "Error",
    "Uncaught Pokemon Cant be released",
    "❌",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}

function lunchPokemonSuccessReleased() {
  createSuccessMssage(
    "green",
    "Success",
    "Pokemon successfully Released",
    "✔️",
    "white"
  );
  const successMssageBox = document.getElementById("successMssageBox");
  successMssageBox.classList.add("active");
}
