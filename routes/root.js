module.exports = function rootRoute(app) {
  app.get("/", (req, res) => {
    const ret = {
      status: "ok",
      message: "server online,",
    };
    res.json(ret);
  });
};
