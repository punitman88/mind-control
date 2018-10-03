var express = require("express");
var app = express();
app.set("view engine", "ejs");

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/signup", function(req,res){
    res.render("signup");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/logout", function(req,res){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Application now running at port 3000");
})