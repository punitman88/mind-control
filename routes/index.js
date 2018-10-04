var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Profile = require("../models/profile");

router.get("/signup", function (req, res) {
    res.render("signup");
});

router.post("/signup", function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var profile = { avatar: "", linkedInUrl: "", gitHubUrl: "" };
    // Associate a profile with user. All non login related information about the user goes into profile.
    Profile.create(profile, function (err, userProfile) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
        } else {
            var user = new User({ firstName: firstName, lastName: lastName, username: username, profile: userProfile });
            User.register(user, req.body.password, function (err, createdUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("/signup");
                }
                passport.authenticate("local")(req, res, function () {
                    req.flash("success", "Welcome to MindControl");
                    res.redirect("/mindcontrol");
                });
            });
        }
    });
});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/mindcontrol",
    failureRedirect: "/login"
}), function (req, res) {

});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
});

module.exports = router;