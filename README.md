## What is Express?

Express is the most popular Node web framework, and is the underlying library for a number of other popular Node web frameworks. It provides mechanisms to:

- Write handlers for requests with different HTTP verbs at different URL paths (routes).
- Integrate with "view" rendering engines in order to generate responses by inserting data into templates.
- Set common web application settings like the port to use for connecting, and the location of templates that are used for rendering the response.
- Add additional request processing "[middleware](#middleware)" at any point within the request handling pipeline.

## Environment

- Assuming you've already installed Node.js & NPM:
  - create project root directory: `mkdir examples` & `cd examples`
  - in project root directory use terminal/shell to `npm init`
  - in project root directory use terminal/shell to: `npm install express --save`
- Nodemon - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.
  - in project root directory use terminal/shell to: `npm install --save-dev nodemon`
  - in package.json add:
    ```
    "scripts": {
        ...,
        "dev": "nodemon index.js"
    },
    ```
- Webpack - when do I need it and why? [hint: build heavy production environment in real life]

## Routing

- Routing determines how an application responds to a client request based on path & method
  - method = GET/POST/PUT/DELETE
  - path = all the string coming after domain
  - basic usage: `app.METHOD(PATH, HANDLER)`
  - you can (and should) have multiple routers for each "model" usage

## Middleware

- Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.
- The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
- Middleware functions can perform the following tasks:
  - Execute any code.
  - Make changes to the request and the response objects.
  - End the request-response cycle.
  - Call the next middleware in the stack.
  - If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

```js
const myMiddleware = function(request, response, next) {
    const {username} = request.headers.username;
    if (username && userNameExist(username)) {
        next();
    }

    createNewUserDir(username);
    next();
})
```

### **Parsing Requests**

To parse incoming request we use json middleware in our app initiation
`express.json()` middleware - parses incoming requests with JSON payloads and is based on body-parser.

- GET - use `request.query`
- POST - use `request.body`
- PUT - use `request.body`
- DELETE - use `request.body`
- You can also parse data out of the url by using path (`request.params`).
- You can also parse data out the headers by using headers (`request.headers`)

### **Handling Errors**

- error handling in Express is done using middleware.
- this middleware has special properties
- the error handling middleware are defined in the same way as other middleware functions, except that error-handling functions MUST have four arguments instead of three – err, req, res, next.
  ```js
  app.use(function (err, req, res, next) {
    res.status(500);
    res.send("Oops, something went wrong.");
  });
  ```

### **Response Types**

- a JSON response, usually used for API: `response.json(...)`
  - all it does is just putting `content-type: application/json` in the response header to inform the client how to treat the response
- an HTML response, usually used for WEB pages `response.send(...)`
  - all it does is just putting `content-type: text/html` in the response header to inform the client how to treat the response

### **Static Files**

- Which files should be statically served?
- `app.use(express.static('STATIC_FOLDER_NAME'))`

## Assignment

1. Start a new express project
   1. Create a folder named `pokemon-api`
   2. Init a package file for the project
   3. Install `express` project dependency
   4. Install `nodemon` as development dependency
   5. [Declare a script](https://www.freecodecamp.org/news/introduction-to-npm-scripts-1dbb2ae01633/) named `dev` which executes `nodemon index.js` in `package.json`
2. Create file `index.js`:

   ```js
   const express = require("express");
   const app = express();
   const port = 8080;

   // start the server
   app.listen(port, function () {
     console.log("app started");
   });

   // route our app
   app.get("/", function (req, res) {
     res.send("hello world!");
   });
   ```

3. Use [pokedex-promise-v2](https://github.com/PokeAPI/pokedex-promise-v2) package to make requests to [pokeapi](https://pokeapi.co/)
   1. Follow the steps on github repo for installation and usage
   2. You should use `getPokemonByName` method in your assigment
4. make new router `pokemonRouter.js` in your `/src/routers/` path with the following endpoints:

   1. GET - `/pokemon/get/:id` - should respond with a pokemon queried by its id using [Route parameters](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes#route_parameters)
   2. GET - `/pokemon/query` - should respond with a pokemon queried by its name using a JSON send in the requests query: `{ query: <string> }`
   3. Response format should be:

   ```
   {
      name: <string>
      height: <numeric>
      weight: <numeric>
      types: [ <string> ]
      front_pic: <string>
      back_pic: <string>
      abilities: [ <string> ]
   }
   ```

   3. PUT - `/pokemon/catch/:id` - should serve requests asking to catch a pokemon `{ pokemon: <pokemon object> }`
      1. This request will check if this pokemon exists in `./users/<username>/` dir (example: `./users/max-langerman/134.json`)
      2. If pokemon already caught (file already exist on the server), it will generate an error with `403` error code
      3. If pokemon haven't been caught yet (file does not exist on the server), it will create a new json file.
      4. File content = `{pokemon object}`. file name = `<pokemon_id>.json`
   4. DELETE - `/pokemon/release/:id` - should serve requests asking to delete already caught pokemon
      1. This request will check if this pokemon exists in `/users/<username>/` dir
      2. If pokemon have been caught (file already exist on the server), it will release the pokemon (delete the file)
      3. If pokemon haven't been caught yet (file does not exist on the server), it will generate an error with 403 error
   5. GET - `/pokemon/` - should serve requests asking to list all pokemons caught by the user (list and parse all files inside `/users/<username>`)

5. Create a router `./src/routers/userRouter.js` with the following endpoint:
   1. POST - `/info` - should respond with user's name: `{ username: <string> }`
6. Create a error handeling middleware in `./src/middleware/errorHandler.js` dir to handle server errors:
   1. 404 for not found pokemons
   2. 403 for releasing an uncaught pokemon, or catching an already caught pokemon
   3. 500 for server errors
   4. 401 for unauthenticated user request (pokemon requests missing the username header)
7. Create `userHandler.js` middleware in `./src/middleware` dir to handle users
   1. Username will be sent as an HTTP header: `"username": "<string>"`
   2. Each request accessing `pokemonRouter` will go through that middleware
   3. The middleware will parse the username from the request header and will use its value to respond catch/release requests
   4. If username header is missing in these requests (pokemon requests) it will generate an error with 401 error code
8. Update your previous pokedex client app functionality to support new `pokedex-api` logic
   1. Your pokedex should have a way for the user to enter his `username` to be sent as a header for each api request
   2. Search by ID (`<number>`) functionality should be directed to your server endpoint `/pokemon/get/:id` with route params
   3. Search by name (`<string>`) functionality should be directed to your server endpoint `/pokemon/query` with body params
   4. Add "catch pokemon" functionality using the `/pokemon/catch/:id` api route
   5. Add a "release pokemon" functionality using the `/pokemon/release/:id` api route
   6. Update your previous pokdex app functionality to support new response format
   7. Add a user feature for seeing the caught pokemon list
   8. Handle [errors gracefuly](<https://stackoverflow.com/questions/8825384/alert-is-bad-really#:~:text=never%20use%20alert()%3F-,alert%20is%20bad%20simply,-because%20it%20has>)

---

BONUS: wrap your previous pokedex client project with [Webpack Boilerplate](https://github.com/taniarascia/webpack-boilerplate)

## Resources

[express.js](https://expressjs.com/)

[pokeapi](https://pokeapi.co/)

[HTTP response codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**You should pair up for this assignment**

**Each of you will develop a backend & frontend**

**Your frontend should be developed on a new branch of your already existing client**

**Your frontend should support _your partner's_ backend**

**When done, turn in your server github repo + your partner's client github repo**

# Good Luck!
