const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;

const path = require("path");

const express = require("express");
const app = express();

const NodeCouchDb = require("node-couchdb");

const couch = new NodeCouchDb({
	host: 'ampere.calebsservers.ga',
    protocol: 'http',
    port: 5984,
	auth: {
		user: "backend",
		password: "BoardBackend2012"
	}
});
const dbName = "boards";
const viewURL = "_design/main/_view/main";

app.use("/file", express.static(path.join(__dirname, "static/audio")));

//Get object
app.get("/boards", (req, res) => {
	console.log("finding")
	couch.get(dbName, viewURL).then(({data, headers, status}) => {
		console.log(data);
		res.send("success");
	});
});

//Update object
app.post("/boards", (req, res) => {});

app.listen(3000, () => {
	console.log(`Listening on port ${port}. http://localhost:${port}`);
});
