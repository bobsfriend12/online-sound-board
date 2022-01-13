const log4js = require("log4js")
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PASSWORD;
const logLevel = process.env.LOG_LEVEL;

const path = require("path");

const express = require("express");
const app = express();

log4js.configure({
	appenders: { 
		file: { type: "dateFile", filename: "logs/app.log", layout: {type: "basic"}, compress: true, daysToKeep: 14, keepFileExt: true },
		console: {type: "console"} },
	categories: { info: { appenders: ["file", "console"], level: logLevel } }
  });
   
const logger = log4js.getLogger();

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
	logger.info("/boards request recieved from " + req.ip);
	couch.get(dbName, viewURL).then(({data, headers, status}) => {
		const boards = {
			status: "success"
		}
		boards.numOfBoards = data.total_rows;
		boards.boards = data.rows;
		logger.info("Sent boards to " + req.ip);
		res.json(boards);
	}, (err) => {
		const boards = {
			status: "error",
			message: "error getting boards",
			error: err
		}
		logger.error("Error getting boards" + err);
		res.send(boards);
	});
});

//Takes in board object to update and
//updates the doc in the db
app.post("/update/board", (req, res) => {
	logger.info(`updating board ${req.body.id} from ${req.ip}`);
	const board = req.body;
		couch.update(dbName, board).then(({data, headers, status}) => {
			let response = {
				status: "Success",
				message: "Doc updated"
			}
			logger.info("successfully updated the board");
			res.json(response);
		}, err => {
			let response = {
				status: "error",
				message: "failed to update doc"
			}
			response.error = err;
			logger.error("Error updating boards: " + err);
			res.json(response);
		})
});

app.post("/new/board", (req, res) => {
	logger.info()
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
