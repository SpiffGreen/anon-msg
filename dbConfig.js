const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.dir("Connected to Database"))
    .catch((err) => console.warn(err));
