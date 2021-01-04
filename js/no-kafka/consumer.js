var Kafka = require("no-kafka");
var consumer = new Kafka.SimpleConsumer();

var dataHandler = function (messageSet, topic, partition) {
  messageSet.forEach(function (m) {
    console.log(topic, partition, m.offset, m.message.value.toString("utf8"));
  });
};

var strategies = [
  {
    subscriptions: ["kafka-test-topic"],
    handler: dataHandler,
  },
];

consumer.init(strategies);
