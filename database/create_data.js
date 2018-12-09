var mongoose = require("mongoose");

function createDataHandler(topic, message) {
  var payload = JSON.parse(message);
  var Key = mongoose.model(topic);
  var key = new Key();
  Object.keys(payload).forEach(function(i) {
    key[i] = payload[i];
  });
  key.save(function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log("topic : " + topic + " message : " + message);
    }
  });
}

module.exports.createDataHandler = createDataHandler;
