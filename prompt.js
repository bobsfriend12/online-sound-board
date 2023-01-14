const myRL = require("serverline");
const logger = require("./logger").logger;

//=======================================
//=================Prompt================
//=======================================
//#region prompt

function cmdHelp() {
  console.log(
    "Commands: \nfreeze - freeze express and prevent any api requests"
  );
  console.log("resume - start accepting requests again.");
  console.log("backup - Backups the database locally.");
  console.log("restore - restore from the local backup");
  console.log("clear - clear all log messages from terminal.");
  console.log("exit - exit the app.");
}

function cmdFreeze() {
  frozen = true;
  if (httpsServer === "true") {
    server.close(() => logger.warn("freezing express"));
  } else {
    server.close(() => logger.warn("freezing express"));
  }
}

function cmdResume() {
  if (frozen === true) {
    if (httpsServer === "true") {
      startServer();
      frozen = false;
    } else {
      server = app.listen(port, () => {
        logger.info(`Started http server on ${port}`);
        frozen = false;
      });
    }
  } else {
    logger.info("Server already running");
  }
}

function cmdRestore() {
  let adminUser, adminPwd;
  myRL.question("What is your couchDB admin username?", (ans) => {
    adminUser = ans;
    myRL.secret("What is your couchDB admin password?", (ans) => {
      adminPwd = ans;
      const url = `https://${adminUser}:${adminPwd}@${dbHost}:${dbPort}`;
      function done(err) {
        if (err) {
          return logger.error(err);
        }
        logger.info("Restore complete");
      }
      var config = { credentials: url, databases: [dbName] };
      fs.createReadStream("./backup/db-backup.tar.gz").pipe(
        cbr.restore(config, done)
      );
    });
  });
}

function cmdBackup() {
  let adminUser, adminPwd;
  myRL.question("What is your couchDB admin username?", (ans) => {
    adminUser = ans;
    myRL.secret("What is your couchDB admin password?", (ans) => {
      adminPwd = ans;
      const url = `https://${adminUser}:${adminPwd}@${dbHost}:${dbPort}`;
      function done(err) {
        if (err) {
          return logger.error(err);
        }
        logger.info("Backup complete");
      }
      var config = { credentials: url, databases: [dbName] };
      // backup
      if (!fs.existsSync(path.join(__dirname, "backup"))) {
        logger.debug("Creating backup directory");
        fs.mkdirSync(path.join(__dirname, "backup"));
      }
      let wrstream = fs.createWriteStream("./backup/db-backup.tar.gz");
      wrstream.on("open", (fd) => {
        cbr.backup(config, done).pipe(wrstream);
      });
    });
  });
}

function cmdExit() {
  logger.fatal("Good Bye");
  process.exit();
}

function cmdClear() {
  console.log("\033[2J");
}

async function commandPrompt() {
  logger.debug("initializing command prompt");
  myRL.init();
  myRL.setCompletion([
    "help",
    "freeze",
    "backup",
    "exit",
    "clear",
    "restore",
    "resume",
  ]);
  myRL.on("line", function (line) {
    switch (line.trim()) {
      case "help":
        cmdHelp();
        break;
      case "freeze":
        cmdFreeze();
        break;
      case "resume":
        cmdResume();
        break;
      case "backup":
        cmdBackup();
        break;
      case "restore":
        cmdRestore();
        break;
      case "exit":
        cmdExit();
        break;
      case "clear":
        cmdClear();
        break;
      default:
        logger.warn("Unknown command");
    }
  });
}

module.exports = {
  commandPrompt,
};
