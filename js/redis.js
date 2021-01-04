var redis = require("redis"),
  client = redis.createClient();

client.on("error", function(err) {
  console.log("Error " + err);
});

client.get("user", function(err, reply) {
  if (err) {
    console.log(err);
  }
  console.log(reply);
});
client.quit();
