var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var User = require("../models/user");
var Profile = require("../models/profile");

router.get("/profiles/:id", middleware.isLoggedIn, function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            Profile.findOne({ _id: foundUser.profile }, function (err, foundProfile) {
                if (err) {
                    req.flash("error", err.message);
                    console.log(err);
                } else {
                    res.render("profile", { profile: foundProfile });
                }
            });
        }
    });
});

router.put("/profiles/:id", middleware.isLoggedIn, function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, foundUser) {
        if (err) {
            req.flash("error", err.message);
            console.log(err);
        } else {
            Profile.findByIdAndUpdate(foundUser.profile._id, req.body.profile, function (err, updatedProfile) {
                if (err) {
                    req.flash("error", err.message);
                    console.log(err);
                } else {
                    req.flash("success", "Successfully edited profile");
                    res.redirect("/profiles/" + foundUser._id);
                }
            })
        }
    });
});

module.exports = router;