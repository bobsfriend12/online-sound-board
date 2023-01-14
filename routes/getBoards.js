const logger = require("../logger").logger;

module.exports = function getBoardsRoute(app, couch, dbName, viewURL) {
  app.get("/boards", (req, res) => {
    logger.info("/boards request recieved from " + req.ip);
    couch.get(dbName, viewURL).then(
      ({ data, headers, status }) => {
        const boards = {
          status: "success",
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
          boardObj.settings = data.rows[i].value.settings;
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
          error: err,
        };
        logger.error("Error getting boards" + err);
        res.send(boards);
      }
    );
  });
};
