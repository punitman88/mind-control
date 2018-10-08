const router = require("express").Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", {
    scope: ["profile"]
}));

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("/profile");
});

module.exports = router;