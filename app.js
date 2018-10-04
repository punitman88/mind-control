var express = require("express");
var app = express();
app.set("view engine", "ejs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mind-control", { useNewUrlParser: true, useCreateIndex: true });
var User = require("./models/user");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var expressSession = require("express-session")({
    secret: "fusemachines",
    resave: false,
    saveUninitialized: false
});
app.use(expressSession);

var passport = require("passport");
var LocalStrategy = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var flash = require("connect-flash");
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var user = new User({ firstName: firstName, lastName: lastName, username: username });
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
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/mindcontrol",
    failureRedirect: "/login"
}), function (req, res) {
    console.log("Something went wrong.");
});

app.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/");
});

app.get("/mindcontrol", isLoggedIn, function (req, res) {
    res.render("mindcontrol");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to be logged in to perform that action");
        res.redirect("login");
    }
}

app.listen(3000, function () {
    console.log("Application now running at port 3000");
})