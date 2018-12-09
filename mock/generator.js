function IntRandom(min = 0, max = 10) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

function BoolRandom(per = 50) {
  if (per < 0 || 100 < per) {
    return null;
  }
  return Math.floor(Math.random() * 100) <= per ? true : false;
}

function FloatRandom(min = 0.0, max = 10.0, fix = 4) {
  return (Math.random() * (max + 1 - min) + min).toFixed(fix);
}

const testData = [
  {
    time: 0.0,
    data: {
      id: { type: "static", value: 1 },
      isActive: { type: "boolRandom", per: 40 },
      date: { type: "date" }
    }
  },
  {
    time: 6.0,
    data: {
      id: { type: "static", value: 1 },
      isActive: { type: "boolRandom", per: 40 },
      date: { type: "date" }
    }
  },
  {
    time: 12.0,
    data: {
      id: { type: "static", value: 1 },
      isActive: { type: "boolRandom", per: 40 },
      date: { type: "date" }
    }
  },
  {
    time: 18.0,
    data: {
      id: { type: "static", value: 1 },
      isActive: { type: "boolRandom", per: 40 },
      date: { type: "date" }
    }
  },
  {
    time: 24.0,
    data: {
      id: { type: "static", value: 1 },
      isActive: { type: "boolRandom", per: 40 },
      date: { type: "date" }
    }
  }
];

require("./broker");
const mqtt = require("mqtt");
const client = mqtt.connect({
  host: "localhost",
  port: 1883,
  clientId: "mqtt.publisher"
});
client.on("connect", () => console.log("publisher.connected."));

function publish(topic, message) {
  // console.log(message);

  client.publish(topic, JSON.stringify(message));
}

function hokan(timeData, topic, div = 1) {
  timeData.sort(function(a, b) {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    return 0;
  });
  let i = 0;
  const interval = setInterval(function() {
    const now = new Date();
    const nowTime = orgFloor(
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600,
      1000 * div
    );
    let message = {};
    Object.keys(timeData[i].data).forEach(function(key) {
      let val = timeData[i].data[key];
      switch (val.type) {
        case "change":
          if (!val.perData) {
            val.perData = orgFloor(
              (timeData[i + 1].data[key].value - val.value) /
                (timeData[i + 1].time - timeData[i].time),
              1000 * div
            );
          }
          const rand = Math.random();
          if (rand <= 0.001) {
            let diff = 0.0;
            if (rand <= 0.5) {
              diff = Math.random() * -0.2;
            } else {
              diff = Math.random() * 0.2;
            }
            val.perData = orgFloor(
              (timeData[i + 1].data[key].value + diff - val.value) /
                (timeData[i + 1].time - timeData[i].time),
              1000 * div
            );
          }
          const perMin = orgFloor(nowTime - timeData[i].time, 1000 * div);
          message[key] = orgFloor(val.perData * perMin + val.value, 10000);
          break;
        case "boolRandom":
          const per = val.per ? val.per : 50;
          message[key] = BoolRandom(per);
          break;
        case "intRandom":
          message[key] = IntRandom(val.min, val.max);
          break;
        case "floatRandom":
          const fix = val.fix ? val.fix : 4;
          message[key] = FloatRandom(val.min, val.max, fix);
          break;
        case "static":
          message[key] = val.value;
          break;
        case "date":
          message[key] = now.toJSON();
        default:
          break;
      }
    });
    publish(topic, message);
    if (nowTime >= timeData[i + 1].time) {
      i++;
    }
    if (nowTime === 0) {
      // clearInterval(interval);
      i = 0;
    }
  }, 1000 * div);
}

function orgFloor(value, base) {
  return Math.floor(value * base) / base;
}

hokan(testData, "toire", 10);
