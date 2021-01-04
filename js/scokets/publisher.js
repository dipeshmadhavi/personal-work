let express = require("express");
let app = express();

let http = require("http");
let server = http.Server(app);

let socketIO = require("socket.io");
let io = socketIO(server);

const port = process.env.PORT || 3000;
const message = "this is test message";
let count = 0;
io.on("connection", (socket) => {
  console.log("user connected");

  setInterval(function () {
    socket.emit("new message", `${count} message`);
    console.log(`${count} message`);

    count++;
  }, 5000);
  // socket.emit("new message", message);

  // socket.on("new-message", (message) => {
  //   console.log(message);
  // });
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
