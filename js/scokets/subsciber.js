let express = require("express");
let app = express();

let http = require("http");
let server = "http://localhost:3000";

let socketIO = require("socket.io-client");
let io = socketIO(server);

io.on("new-message", (message) => {
  console.log(message);
});
