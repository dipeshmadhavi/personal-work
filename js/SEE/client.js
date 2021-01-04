var EventSource = require('eventsource');
var eventSourceInitDict = {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  },
  body: {},
};
var es = new EventSource(
  'http://localhost:3000/gettimeoutdata',
  eventSourceInitDict
);
es.onmessage = function (event) {
  console.log(event.data);
};

es.onerror = function (err) {
  if (err) {
    if (err.status === 401 || err.status === 403) {
      console.log('not authorized');
    }
  }
};
