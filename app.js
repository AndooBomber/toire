const cac = require("cac");
const cli = cac();

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

cli.command(
  "server",
  {
    desc: `--db データベースに保存
        --sub subscribe 
        --loop subをloopする
        --mock mqtt publisherの立ち上げ`
  },
  async (input, flag) => {
    if (flag.mock) {
      const pub = require("./mock/generator");
      pub.publish(testData, "toire", 10);
    }

    let db,
      loop = false;
    if (flag.db) {
      await require("./database/mongo");
      db = true;
      const database = require("./database/get_data");
      const option = {
        id: 1,
        isActive: false
      };
      const datas = database.getDataHandler("toire");

      datas.then(data => {
        console.log("datas = ", data);
      });
    }

    if (flag.loop) {
      loop = true;
    }

    if (flag.sub) {
      const mqtt = require("./mock/subscriber");
      const client = mqtt.subscribe(["toire"]);
      client.on("message", function(topic, message) {
        console.log(topic + ":" + message);
        if (db) {
          var data = require("./database/create_data");
          data.createDataHandler("toire", message);
        }
        // break loop
        if (!loop) {
          client.unsubscribe(topic);
        }
      });
    }

    charts();
  }
);

cli.parse();

function charts() {
  var express = require("express");
  var path = require("path");
  var logger = require("morgan");
  var cookieParser = require("cookie-parser");
  var bodyParser = require("body-parser");

  var app = express();

  var http = require("http");
  var port = normalizePort(process.env.PORT || "8080");
  app.set("port", port);
  var server = http.createServer(app);
  server.listen(port);

  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", require("./routes/index.js"));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  module.exports = app;
}
