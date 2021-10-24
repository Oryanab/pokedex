"use strict";

/*
    function will receive a pokemon name and return its jsonData
*/
// async function searchPokemon(pokemonName) {
//   let getPokemonJson = `http://localhost:8080/pokemon/${pokemonName}`;
//   const pokemonJsonData = await axios.get(getPokemonJson);
//   console.log(pokemonJsonData["data"]);
//   return pokemonJsonData["data"];
// }

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
    console.log("success");
  } catch (e) {
    console.log("e");
  }
}

// async function signUpUser(userName) {
//   const jsonReturned = await fetch("http://localhost:8080/users/signup", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       username: userName,
//     },
//     body: JSON.stringify({
//       username: userName,
//     }),
//   });
//   console.log(jsonReturned.json());
// }

document.querySelector("#btn-signup").addEventListener("click", async (e) => {
  const newUserName = document.querySelector("#sign-up-area").value;
  return await signUpUser(newUserName);
});

// //const userName = document.querySelector("#username").value;
// async function userAuth(userName) {
//   let userAuth = `http://localhost:8080/users/${userName}/info`;
//   try {
//     const checkUserData = await axios({
//       method: "post",
//       url: userAuth,
//       body: {
//         username: userName,
//       },
//       headers: { "Content-Type": "application/json" },
//     });
//     return checkUserData.status;
//   } catch (e) {
//     return e;
//   }
// }

// document.querySelector("#btn-signup").addEventListener("click", (e) => {
//   e.preventDefault();
//   const newUserName = document.querySelector("#sign-up-area").value;

//   signUpUser(newUserName);
// });
