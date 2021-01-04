const express = require('express');
const parser = require('body-parser');
const app = express();
const EventEmitter = require('events');
const stream = new EventEmitter();

app.use(parser.json());
app.use(
  parser.urlencoded({
    extended: true,
  })
);

app.post('/home', function (req, res) {
  res.writeHead(200, {
    'Content-type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  // res.write('data: Hello there \n\n');
  // res.end();
  for (let index = 0; index <= 10; index++) {
    res.write('data: Index at' + index + '\n\n');

    // await this.setTime();
  }
  res.end();
  // stream.on('push', function (event, data) {
  //   res.write(`data: event ${event} data ${JSON.stringify(data)} \n\n`);
  // });
});

// setInterval(function () {
//   stream.emit('push', 'message', { msg: 'it works!!' });
// }, 10000);

function setTime() {
  return new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, 500);
  });
}

app.listen(3000);

console.log(`Success`);
