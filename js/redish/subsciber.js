const redis = require("redis");

const subscriber = redis.createClient();

subscriber.on("message", function (channel, message) {
  console.log(
    "Subscriber received message in channel '" + channel + "': " + message
  );

  //   subscriber.unsubscribe();
  //   subscriber.quit();
});

subscriber.subscribe("channel-0");
