var express = require("express");
var router = express.Router();
var middleware = require("../middleware");

router.get("/mindcontrol", middleware.isLoggedIn, function (req, res) {
    res.render("mindcontrol");
});

module.exports = router;