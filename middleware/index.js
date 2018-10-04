var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", "You need to be logged in to perform that action");
        res.redirect("login");
    }
}

module.exports = middlewareObj;