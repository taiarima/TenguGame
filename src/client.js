var socket = io();

document.getElementById("create").addEventListener("click", function () {
  socket.emit("create game");
});

document.getElementById("join").addEventListener("click", function () {
  socket.emit("join game");
});

// Below is experimental:

// Q: How would I change the below code to properly interact with my script.js file?
// A: You would need to change the code in the server.js file to emit the game ID to the client. 
// Then, you would need to change the code in the client.js file to listen for the game ID and display it to the user.
// 

var socket = io();

document.getElementById("create").addEventListener("click", function () {
  socket.emit("create game");
});

document.getElementById("join").addEventListener("click", function () {
  const gameId = prompt("Enter game ID:");
  socket.emit("join game", gameId);
});

socket.on("game created", function (gameId) {
  // Display the game ID to the user
  alert("Game created! Share this ID with your opponent: " + gameId);
});

socket.on("game joined", function () {
  // Redirect the user to the game page or start the game
  location.href = "game.html";
});

socket.on("game not found", function () {
  alert("Invalid game ID!");
});