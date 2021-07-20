const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    text: {
        required: true,
        type: String
    },
    userId: {
        required: true,
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now,
        index: {
            // expires: 259200 // Three days
            // expires: 86400 // 24 hours - One day
            expires: 60 // 1 minute
        }
    }
});

module.exports = mongoose.model("Message", schema);