const log4js = require("log4js")
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PASSWORD;

const path = require("path");

const express = require("express");
const app = express();

log4js.configure({
	appenders: { 
		file: { type: "dateFile", filename: "logs/app.log", layout: {type: "basic"}, compress: true, daysToKeep: 14, keepFileExt: true },
		console: {type: "console"} },
	categories: { info: { appenders: ["file", "console"], level: "info" } }
  });
   
  const logger = log4js.getLogger("cheese");
  logger.trace("Entering cheese testing");
  logger.debug("Got cheese.");
  logger.info("Cheese is Comté.");
  logger.warn("Cheese is quite smelly.");
  logger.error("Cheese is too ripe!");
  logger.fatal("Cheese was breeding ground for listeria.");

const NodeCouchDb = require("node-couchdb");

const couch = new NodeCouchDb({
	host: process.env.DB_HOST,
    protocol: process.env.DB_PROTOCOL,
    port: process.env.DB_PORT,
	auth: {
		user: dbUser,
		password: dbPwd
	}
});
const dbName = process.env.DB_NAME;
const viewURL = process.env.DB_VIEW;

app.use("/file", express.static(path.join(__dirname, "static/audio")));

//Get object
app.get("/boards", (req, res) => {
	console.log("Recieved request from " + req.ip);
	couch.get(dbName, viewURL).then(({data, headers, status}) => {
		const boards = {
			status: "success"
		}
		boards.numOfBoards = data.total_rows;
		boards.boards = data.rows;
		console.log("Sent boards to " + req.ip);
		res.json(boards);
	}, (err) => {
		const boards = {
			status: "error",
			message: "error getting boards",
			error: err
		}
		console.error("Error getting boards" + err);
		res.send(boards);
	});
});

//Takes in board object to update and
//updates the doc in the db
app.post("/update/board", (req, res) => {
	const board = req.body;
	let _id, _rev;
	if (board._id) {
		couch.update(dbName, board).then(({data, headers, status}) => {
			let response = {
				status: "Success",
				message: "Doc updated"
			}
			res.json(response);
		}, err => {
			let response = {
				status: "error",
				message: "failed to update doc"
			}
			response.error = err;
			res.json(response);
		})
	}
});

app.post("/new/board", (req, res) => {
	couch.uniqid().then((ids) => {
		const _id = ids[0];
		board._id=_id;
		couch.insert(dbName, board).then(({data, headers, status}) => {
			let response = {
				status: "success",
				message: "created new doc"
			}
			res.json(response);
		}, err => {
			let response = {
				status: "error",
				message: "Error creating new doc"
			}
			response.error = err;
			res.json(response);
		});
	});
});

app.listen(3000, () => {
	console.log(`Listening on port ${port}. http://localhost:${port}`);
});
