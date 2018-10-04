var express = require("express");
var app = express();
app.set("view engine", "ejs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/mind-control", { useNewUrlParser: true });
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
            res.redirect("/signup");
        }
        console.log("Redirecting");
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/logout", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Application now running at port 3000");
})