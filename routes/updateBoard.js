const logger = require("../logger").logger;

module.exports = function updateBoardRoute(app, couch, dbName) {
  //Takes in board object to update and
  //updates the doc in the db
  app.post("/update/board", (req, res) => {
    try {
      logger.info(`updating board ${req.body.id} from ${req.ip}`);
      const board = req.body;

      const mangoQuery = {
        selector: {
          id: { $gte: board.id },
        },
      };
      //Make mango query to make sure that _rev is up to date
      //and to make sure that there is an _id
      couch
        .mango(dbName, mangoQuery, {})
        .then(({ data, headers, status }) => {
          try {
            logger.debug("board found");

            logger.debug(JSON.stringify(data.docs));

            if (data.docs.length === 0) {
              throw "No board found";
            }

            board._id = data.docs[0]._id;
            board._rev = data.docs[0]._rev;

            couch
              .update(dbName, board)
              .then(({ data, headers, status }) => {
                let response = {
                  status: "Success",
                  message: "Doc updated",
                };
                logger.info("successfully updated the board");
                res.json(response);
              })
              .catch((err) => {
                throw err;
              });
          } catch (err) {
            let response = {
              status: "error",
              message: "failed to update doc",
            };
            response.error = err;
            logger.error("Error updating boards: " + err);
            res.status(500);
            res.json(response);
          }
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      let response = {
        status: "error",
        message: "failed to update doc",
      };
      response.error = err;
      logger.error("Error updating boards: " + err);
      res.status(500);
      res.json(response);
    }
  });
};
