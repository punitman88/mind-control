var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
    avatar: String,
    linkedInUrl: String,
    gitHubUrl: String
});

module.exports = mongoose.model("Profile", ProfileSchema);