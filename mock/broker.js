"use strict";

const mosca = require("mosca");

const MQTT_PORT = 1883;

const broker = new mosca.Server({ port: MQTT_PORT });

broker.on("ready", () => console.log("Server is ready."));
broker.on("clientConnected", client =>
  console.log("broker.on.connected.", "client:", client.id)
);
broker.on("clientDisconnected", client =>
  console.log("broker.on.disconnected.", "client:", client.id)
);
// broker.on("subscribed", (topic, client) =>
//   console.log("broker.on.subscribed.", "client:", client.id, "topic:", topic)
// );
broker.on("unsubscribed", (topic, client) =>
  console.log("broker.on.unsubscribed.", "client:", client.id)
);
// broker.on("published", (packet, client) => {
//   if (/\/new\//.test(packet.topic)) return;
//   if (/\/disconnect\//.test(packet.topic)) return;
//   console.log("broker.on.published.", "client:", packet.topic);
// });
