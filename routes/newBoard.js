const logger = require("../logger").logger;

module.exports = function newBoardRoute(app, couch, dbName) {
  app.post("/new/board", (req, res) => {
    try {
      logger.info("New Board request received from " + req.ip);
      const board = req.body;
      couch.uniqid().then((ids) => {
        const _id = ids[0];
        board._id = _id;
        couch
          .insert(dbName, board)
          .then(({ data, headers, status }) => {
            let response = {
              status: "success",
              message: "created new doc",
            };
            logger.info("Successfully created new board");
            res.json(response);
          })
          .catch((err) => {
            throw err;
          });
      });
    } catch (err) {
      let response = {
        status: "error",
        message: "Error creating new doc",
      };
      response.error = err;
      logger.error("Failed to create new board" + err);
      res.json(response);
    }
  });
};
