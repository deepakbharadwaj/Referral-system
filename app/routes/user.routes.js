const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user", [authJwt.verifyToken], controller.userProfile);
  app.post("/api/submitLead", [authJwt.verifyToken], controller.submitLead);
  app.get("/api/myLeads", [authJwt.verifyToken], controller.myLeads);
};
