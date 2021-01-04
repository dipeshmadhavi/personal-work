var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");

// const bucket = new Uint16Array(["A", "B", "C"]);
// console.log(bucket);

client.on("connect", function() {
  client.subscribe("presence", function(err) {
    if (!err) {
      client.publish("presence", bucket);
    }
  });
});

client.on("message", function(topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
