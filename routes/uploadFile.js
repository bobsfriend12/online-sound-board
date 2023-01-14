const logger = require("../logger").logger;

module.exports = function uploadFileRoute(app) {
  app.post("/upload", (req, res) => {
    logger.info("Uploading file from " + req.ip);

    try {
      const file = req.files.audio;
      const id = req.body.id;
      const fileExt = req.body.fileExtension;

      file.mv("./static/audio/" + id + "." + fileExt);
      const ret = {
        status: "success",
        data: {
          name: file.name,
          size: file.size,
        },
      };
      res.json(ret);
      logger.debug("successfully uploaded file: " + id + "." + fileExt);
    } catch (err) {
      logger.error("Error uploading file: " + err);
      res.status(500).send(err);
    }
  });
};
