function subscribe(topic) {
  var mqtt = require("mqtt");
  let client = mqtt.connect({
    host: "localhost",
    port: 1883,
    clientId: "mqtt.subscriber"
  });

  client.on("connect", function() {
    console.log("subscriber.connected.");
  });

  topic.forEach(element => {
    client.subscribe(element, function(err, granted) {
      console.log(element + "subscriber.subscribed.");
    });
  });

  return client;
}

module.exports.subscribe = subscribe;
