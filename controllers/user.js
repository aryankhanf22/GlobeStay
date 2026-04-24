const user = require("../models/user.js");

module.exports.renderSignup=(req, res) => {
  res.render("user/signup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new user({ username, email });
      let registerUser = await user.register(newuser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to GlobeStay");
        res.redirect("/listing");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLogin=(req, res) => {
  res.render("user/login.ejs");
}
module.exports.login= async (req, res) => {
    req.flash("success", "Welcome Back you are logged in !!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }
   
  module.exports.logout= (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully");
    res.redirect("/listing");
  });
}