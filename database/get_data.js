async function getDataHandler(key, option = {}) {
  let mongoose = require("mongoose");
  let model = mongoose.model(key);
  let len = Object.keys(option).length;
  if (len > 0) {
    const datas = await model.find(option, function(err, records) {
      return records;
    });
    return datas;
  }
  const datas = await model.find({}, function(err, records) {
    return records;
  });
  return datas;
}

module.exports.getDataHandler = getDataHandler;
