var kafka = require("kafka-node"),
  Producer = kafka.Producer,
  client = new kafka.KafkaClient(),
  producer = new Producer(client);

let count = 0;

producer.on("ready", function () {
  console.log("ready");
  setInterval(function () {
    payloads = [
      { topic: "dog", messages: `I have ${count} dogs`, partition: 0 },
    ];

    producer.send(payloads, function (err, data) {
      console.log(data);
      count += 1;
    });
  }, 5000);
});

producer.on("error", function (err) {
  console.log(err);
});
