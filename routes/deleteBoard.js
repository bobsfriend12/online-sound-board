const logger = require("../logger").logger;
const fs = require("fs");

module.exports = function deleteBoardRoute(app, couch, dbName) {
  app.delete("/board", (req, res) => {
    try {
      logger.info("Deleting board " + req.body.id + " from " + req.ip);
      const board = req.body;

      for (let i = 0; i < board.sounds.length; i++) {
        logger.debug("Deleting file " + board.sounds[i].audioFile);
        fs.unlinkSync("./static/audio/" + board.sounds[i].audioFile, (err) => {
          if (err) {
            logger.error("Error deleting file: " + err);
          }
        });
      }

      const mangoQuery = {
        selector: {
          id: { $gte: board.id },
        },
      };

      couch.mango(dbName, mangoQuery, {}).then(({ data, headers, status }) => {
        board._id = data.docs[0]._id;
        board._rev = data.docs[0]._rev;
        couch
          .del(dbName, board._id, board._rev)
          .then(({ data, headers, status }) => {
            const ret = {
              status: "success",
              message: "deleted board",
            };
            res.json(ret);
          })
          .catch((err) => {
            throw err;
          });
      });
    } catch (err) {
      logger.error("Error deleting board: " + err);
      const ret = {
        status: "error",
        message: "Error deleting board",
        error: err,
      };
      res.json(ret);
    }
  });
};
