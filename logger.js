const log4js = require("log4js");

//log vars
let logLevel, logFile;
if (process.env.DEV_MODE === "true") {
  logLevel = process.env.DEV_LOG_LEVEL;
  logFile = process.env.DEV_LOG_FILE;
} else {
  logLevel = process.env.LOG_LEVEL;
}

// console.log(process.env.DEV_MODE, logLevel);

//=======================================
//=================LOGGING===============
//=======================================
//#region logging
let logWarn;
if (logLevel == undefined) {
  logLevel = "info";
  logWarn = true;
}
log4js.configure({
  appenders: {
    file: {
      type: "dateFile",
      filename: "logs/app.log",
      layout: { type: "basic" },
      compress: true,
      daysToKeep: 14,
      keepFileExt: true,
    },
    console: { type: "console" },
  },
  categories: {
    default: {
      appenders: ["file", "console"],
      level: logLevel,
    },
    noFile: {
      appenders: ["console"],
      level: logLevel,
    },
  },
});
let logger;
if (logFile === "false") {
  logger = log4js.getLogger("noFile");
} else {
  logger = log4js.getLogger();
}

logger.debug("Logging started");

module.exports = {
  logger,
  logWarn,
};
