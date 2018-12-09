var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");
var obj = JSON.parse(
  fs.readFileSync(path.join(__dirname, "/type.json"), "utf8")
);
var Schema = mongoose.Schema;

Object.keys(obj).forEach(function(key) {
  var object = {};
  Object.keys(obj[key]).forEach(function(k) {
    object[k] = JudgeType(obj[key][k]);
  });
  var schema = new Schema(object);
  mongoose.model("" + key, schema);
});

function JudgeType(type) {
  switch (type) {
    case "String":
      return String;
    case "Number":
      return Number;
    case "Boolean":
      return Boolean;
    case "Date":
      return Date;
    case "Array":
      return Array;
  }
}

mongoose.connect("mongodb://localhost:27017/toire");
