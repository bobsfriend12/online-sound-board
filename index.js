const log4js = require("log4js");
const dotenv = require("dotenv");
const path = require("path");
const NodeCouchDb = require("node-couchdb");
const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");screenX

//=======================================
//===============VARIABLES===============
//=======================================
let port,
	dbHost,
	dbPort,
	dbProtocol,
	dbUser,
	dbPwd,
	dbName,
	viewURL,
	logLevel,
	logFile;
dotenv.config();
if (process.env.DEV_MODE === "true") {
	port = process.env.DEV_PORT;
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
	dbHost = process.env.DB_HOST;
	dbPort = process.env.DB_PORT;
	dbProtocol = process.env.DB_PROTOCOL;
	dbUser = process.env.DB_USER;
	dbPwd = process.env.DB_PASSWORD;
	dbName = process.env.DB_NAME;
	viewURL = process.env.DB_VIEW;
	logLevel = process.env.LOG_LEVEL;
}
//=======================================
//=================LOGGING===============
//=======================================
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
			keepFileExt: true
		},
		console: { type: "console" }
	},
	categories: {
		default: {
			appenders: ["file", "console"],
			level: logLevel
		},
		noFile: {
			appenders: ["console"],
			level: logLevel
		}
	}
});
let logger;
if (logFile === "false") {
	logger = log4js.getLogger("noFile");
} else {
	logger = log4js.getLogger();
}

logger.debug("Logging started");
//=======================================
//=============VARIABLE CHECKS===========
//=======================================
if (port == undefined) {
	logger.warn("No port defined defaulting to 3000");
	port = 3000;
}
if (dbProtocol == undefined) {
	logger.fatal("dbProtocol is not defined");
	logger.fatal("Good Bye");
	process.exit();
}
if (dbUser == undefined) {
	logger.fatal("dbUser not defined.");
	logger.fatal("Good Bye");
	process.exit();
}
if (dbPwd == undefined) {
	logger.fatal("dbPwd not defined.");
	logger.fatal("\nGood Bye");
	process.exit();
}
if (viewURL == undefined) {
	logger.fatal("DB_VIEW is not defined");
	logger.fatal("Good Bye");
	process.exit();
}
if (logWarn === true) {
	logger.warn("LOG_LEVEL is not defined defaulting to info");
}

logger.debug("All varibles checks complete.");

//=======================================
//=================Certs=================
//=======================================



//=======================================
//=================COUCHDB===============
//=======================================

const couch = new NodeCouchDb({
	host: dbHost,
	protocol: dbProtocol,
	port: dbPort,
	auth: {
		user: dbUser,
		password: dbPwd
	}
});

logger.debug("couchdb initialized.");

//=======================================
//================EXPRESS================
//=======================================

logger.debug("initializing express");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/file", express.static(path.join(__dirname, "static/audio")));

//Get object
app.get("/boards", (req, res) => {
	logger.info("/boards request recieved from " + req.ip);
	couch.get(dbName, viewURL).then(
		({ data, headers, status }) => {
			const boards = {
				status: "success"
			};
			boards.numOfBoards = data.total_rows;
			let boardObjs = [];
			for (let i = 0; i < data.total_rows; i++) {
				let boardObj = {};
				boardObj._id = data.rows[i].value._id;
				boardObj._rev = data.rows[i].value._rev;
				boardObj.index = data.rows[i].value.index;
				boardObj.id = data.rows[i].value.id;
				boardObj.title = data.rows[i].value.title;
				boardObj.numOfSounds = data.rows[i].value.numOfSounds;
				boardObj.sounds = data.rows[i].value.sounds;
				boardObjs.push(boardObj);
			}
			boards.boards = boardObjs;
			logger.info("Sent boards to " + req.ip);
			res.json(boards);
		},
		(err) => {
			const boards = {
				status: "error",
				message: "error getting boards",
				error: err
			};
			logger.error("Error getting boards" + err);
			res.send(boards);
		}
	);
});

//Takes in board object to update and
//updates the doc in the db
app.post("/update/board", (req, res) => {
	logger.info(`updating board ${req.body.id} from ${req.ip}`);
	const board = req.body;
	couch.update(dbName, board).then(
		({ data, headers, status }) => {
			let response = {
				status: "Success",
				message: "Doc updated"
			};
			logger.info("successfully updated the board");
			res.json(response);
		},
		(err) => {
			let response = {
				status: "error",
				message: "failed to update doc"
			};
			response.error = err;
			logger.error("Error updating boards: " + err);
			res.json(response);
		}
	);
});

app.post("/new/board", (req, res) => {
	logger.info("New Board request received from " + req.ip);
	const board = req.body;
	couch.uniqid().then((ids) => {
		const _id = ids[0];
		board._id = _id;
		couch.insert(dbName, board).then(
			({ data, headers, status }) => {
				let response = {
					status: "success",
					message: "created new doc"
				};
				logger.info("Successfully created new board");
				res.json(response);
			},
			(err) => {
				let response = {
					status: "error",
					message: "Error creating new doc"
				};
				response.error = err;
				logger.error("Failed to create new board" + err);
				res.json(response);
			}
		);
	});
});

const server = (https)

app.listen(port, () => {
	logger.info(`Started server on ${port}`);
});
