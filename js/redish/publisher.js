const redis = require("redis");

const publisher = redis.createClient();
let count = 0;

setInterval(function () {
  publisher.publish("channel-0", `${count} message`);
  console.log(`${count} message`);

  count++;
}, 5000);

// publisher.quit();
