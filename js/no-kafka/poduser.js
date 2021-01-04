var Kafka = require("no-kafka");
var producer = new Kafka.Producer();

return producer
  .init()
  .then(function () {
    return producer.send({
      topic: "kafka-test-topic",
      partition: 0,
      message: {
        value: "Hello!",
      },
    });
  })
  .then(function (result) {
    console.log("result", result);
  });
