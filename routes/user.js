const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signup));

router.
  route("/login")
    .get(userController.renderLogin)
    .post(
      saveredirectUrl,
      passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
      }),
      userController.login
    );

router.get("/logout", userController.logout);
module.exports = router;
