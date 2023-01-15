const log4js = require("log4js");
const path = require("path");
const NodeCouchDb = require("node-couchdb");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const pem = require("pem");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const myRL = require("serverline");
const cbr = require("couchdb-backup-restore");

require("dotenv").config();

const commandPrompt = require("./prompt").commandPrompt;
const logger = require("./logger").logger;

//=======================================
//===============VARIABLES===============
//=======================================
//#region vars
let port,
  httpsServer,
  dbHost,
  dbPort,
  dbProtocol,
  dbUser,
  dbPwd,
  dbName,
  viewURL,
  logLevel,
  logFile,
  needDelay = false,
  frozen = false;
if (process.env.DEV_MODE === "true") {
  port = process.env.DEV_PORT;
  httpsServer = process.env.DEV_HTTPS;
  dbHost = process.env.DEV_DB_HOST;
  dbPort = process.env.DEV_DB_PORT;
  dbProtocol = process.env.DEV_DB_PROTOCOL;
  dbUser = process.env.DEV_DB_USER;
  dbPwd = process.env.DEV_DB_PASSWORD;
  dbName = process.env.DEV_DB_NAME;
  viewURL = process.env.DEV_DB_VIEW;
  logLevel = process.env.DEV_LOG_LEVEL;
  logFile = process.env.DEV_LOG_FILE;
} else {
  port = process.env.PORT;
  httpsServer = process.env.HTTPS;
  dbHost = process.env.DB_HOST;
  dbPort = process.env.DB_PORT;
  dbProtocol = process.env.DB_PROTOCOL;
  dbUser = process.env.DB_USER;
  dbPwd = process.env.DB_PASSWORD;
  dbName = process.env.DB_NAME;
  viewURL = process.env.DB_VIEW;
  logLevel = process.env.LOG_LEVEL;
}
//#endregion

//=======================================
//=============VARIABLE CHECKS===========
//=======================================
//#region checks
if (process.env.DEV_MODE === "true") {
  logger.debug("Running in DEV mode");
}
if (port == undefined) {
  logger.warn("No port defined defaulting to 3000");
  port = 3000;
}
if (httpsServer == undefined) {
  logger.warn("No https server defined defaulting to true");
  httpsServer = true;
}
if (dbProtocol == undefined) {
  logger.fatal("dbProtocol is not defined");
  logger.fatal("\nGood Bye");
  process.exit();
}
if (dbUser == undefined) {
  logger.fatal("dbUser not defined.");
  logger.fatal("\nGood Bye");
  process.exit();
}
if (dbPwd == undefined) {
  logger.fatal("dbPwd not defined.");
  logger.fatal("\nGood Bye");
  process.exit();
}
if (viewURL == undefined) {
  logger.fatal("DB_VIEW is not defined");
  logger.fatal("\nGood Bye");
  process.exit();
}
if (require("./logger").logWarn === true) {
  logger.warn("LOG_LEVEL is not defined defaulting to info");
}

logger.debug("All varibles checks complete.");
//#endregion
//=======================================
//=================CERTS=================
//=======================================
//#region certs
if (!fs.existsSync(path.join(__dirname, "certs"))) {
  logger.debug("no certs folder found");
  logger.debug("creating certs folder");
  fs.mkdirSync(path.join(__dirname, "certs"));
}

//Check if the certs are there
//if not create them
if (
  fs.existsSync("certs/backend.pem") &&
  fs.existsSync("certs/backend-key.pem")
) {
  logger.debug("Certs found");
} else {
  logger.debug("Certs not found");
  logger.debug("Creating certs");
  needDelay = true;
  //Create the certs
  pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
    logger.debug("Saving certs");
    fs.writeFileSync("certs/backend.pem", keys.certificate);
    fs.writeFileSync("certs/backend-key.pem", keys.serviceKey);
  });
}
//#endregion
//=======================================
//=================COUCHDB===============
//=======================================
//#region couch

const couch = new NodeCouchDb({
  host: dbHost,
  protocol: dbProtocol,
  port: dbPort,
  auth: {
    user: dbUser,
    password: dbPwd,
  },
});

logger.debug("couchdb initialized.");
//#endregion

//=======================================
//================EXPRESS================
//=======================================
//#region express
logger.debug("initializing express");
const app = express();

app.use(cors({}));
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(fileUpload({ createParentPath: true }));
app.use("/file", express.static(path.join(__dirname, "static/audio")));

require("./routes").root(app);
require("./routes").getBoards(app, couch, dbName, viewURL);
require("./routes").newBoard(app, couch, dbName);
require("./routes").uploadFile(app);
require("./routes").updateBoard(app, couch, dbName);
require("./routes").deleteBoard(app, couch, dbName);

const startServer = () => {
  var server = https.createServer(
    {
      key: fs.readFileSync("certs/backend-key.pem"),
      cert: fs.readFileSync("certs/backend.pem"),
    },
    app
  );
  server.listen(port, "0.0.0.0", () => {
    logger.info(`Started https server on ${port}`);
  });
};

if (httpsServer === "true") {
  if (needDelay) {
    logger.debug("Server will start in 10 seconds . . .");
    setTimeout(startServer, 10000);
  } else {
    startServer();
    commandPrompt();
  }
} else {
  var server = app.listen(port, "0.0.0.0", () => {
    logger.info(`Started http server on ${port}`);
    commandPrompt();
  });
}
//#endregion
