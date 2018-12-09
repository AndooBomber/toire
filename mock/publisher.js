require("./broker");
var fs = require("fs");
const mqtt = require("mqtt");
const client = mqtt.connect({
  host: "localhost",
  port: 1883,
  clientId: "mqtt.publisher"
});

var obj = JSON.parse(fs.readFileSync("./database/db.json", "utf8"));

client.on("connect", () => console.log("publisher.connected."));

var sensor, len;

setInterval(() => {
  Object.keys(obj).forEach(function(key) {
    if (obj[key].length > 2) {
      len = obj[key].length;
      let random = Math.floor(Math.random() * Math.floor(len));
      sensor = obj[key][random];
      client.publish("" + key + sensor.id, JSON.stringify(sensor));
      console.log("" + key + sensor.id + JSON.stringify(sensor));
    } else {
      sensor = obj[key][0];
      client.publish("" + key + 0, JSON.stringify(sensor));
    }
    // console.log("" + key + " : " + JSON.stringify(sensor));
  });
}, 1000);
