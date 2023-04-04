const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("a user connected");
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});


// Below is experimental:

// Generate a random string to use as the game identifier
function generateGameId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let gameId = "";
  for (let i = 0; i < 6; i++) {
    gameId += chars[Math.floor(Math.random() * chars.length)];
  }
  return gameId;
}

// Keep track of all active game rooms
const activeGames = new Map();

// Listen for "create game" events from clients
io.on("connection", function (socket) {
  socket.on("create game", function () {
    // Generate a new game identifier and add the socket to a new game room
    const gameId = generateGameId();
    socket.join(gameId);
    activeGames.set(gameId, {
      players: [socket],
      numRounds: 0,
      playerScores: new Map(),
    });

    // Send the game identifier back to the client
    socket.emit("game created", gameId);
  });

  socket.on("join game", function (gameId) {
    // Check if the game exists and has an available slot
    const game = activeGames.get(gameId);
    if (game && game.players.length < 2) {
      // Add the socket to the game room
      socket.join(gameId);
      game.players.push(socket);

      // Send a "game joined" event to both players in the game
      io.to(gameId).emit("game joined");

      // If both players have joined, start the game
      if (game.players.length === 2) {
        startGame(gameId);
      }
    } else {
      // If the game doesn't exist or is full, send an error message to the client
      socket.emit("game not found");
    }
  });
});

// Start the game by setting the number of rounds and initializing the player scores
function startGame(gameId) {
  const game = activeGames.get(gameId);
  game.numRounds = 10;
  for (let player of game.players) {
    game.playerScores.set(player.id, 0);
  }
  io.to(gameId).emit("game started");
}