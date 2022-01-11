const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;

const path = require("path");

const express = require("express");
const app = express();

const NodeCouchDb = require("node-couchdb");

const couch = new NodeCouchDb();

app.use("/file", express.static(path.join(__dirname, "static/audio")));

//Get object
app.get("/boards", (req, res) => {});

//Update object
app.post("/boards", (req, res) => {});

app.listen(port, () => {
	console.log(`Listening on port ${port}. http://localhost:${port}`);
});
