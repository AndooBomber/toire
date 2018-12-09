require("./broker");

function publish(number) {
  var fs = require("fs");
  const mqtt = require("mqtt");
  const client = mqtt.connect({
    host: "localhost",
    port: 1883,
    clientId: "mqtt.publisher"
  });
  client.on("connect", () => console.log("publisher.connected."));
  var obj = JSON.parse(fs.readFileSync("../database/db.json", "utf8"));
  var sensor = obj["temperature"][number];
  setInterval(() => {
    client.publish("temperature" + number, JSON.stringify(sensor));
  }, 1000);
}

module.exports.publish = publish;
