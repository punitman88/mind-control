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

var indexRoutes = require("./routes");
var mindControlRoutes = require("./routes/mindcontrol");
app.use(indexRoutes);
app.use(mindControlRoutes);

app.get("/", function (req, res) {
    res.render("landing");
});

app.listen(3000, function () {
    console.log("Application now running at port 3000");
});