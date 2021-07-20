const serveJS = require("serve-dot-js");
const path = require("path");
const Cookies = require("cookies");

if(!process.env.NODE_PRODUCTION) {
    require("env-man").config(__dirname);
}

require("./dbConfig");
const Message = require("./models/Message");

// const keys = ["secret"];
const keys = [process.env.COOKIE_SECRET];

serveJS.setStatic(path.join(__dirname, "views"));
serveJS.setView(path.join(__dirname, "views"));

// Middlewares
serveJS.use(serveJS.json());

serveJS.get("/", (req, res) => {
    // return home page
    const cookie = new Cookies(req, res, {keys});
    const user = cookie.get("user", {signed: true });
    if (!user) {    // First time visiting
        res.render("index.html");
    } else {    // Already a user, return dashboard
        res.redirect("/dashboard");
    }
        // res.render("index.html");
});

serveJS.post("/", async (req, res) => {
    // redirect to dashboard passing its special link
    if(req.body) {
        const name = req.body.username;
        console.log(req.body);
        const cookie = new Cookies(req, res, {keys});
        cookie.set('user', name + "=" + genId(name), { signed: true });
        res.send({success: true});
    } else {
        res.send({success: false});
    }
});
serveJS.get("/dashboard", (req, res) => {
    // return dashboard page
    const cookie = new Cookies(req, res, {keys});
    const user = cookie.get("user", {signed: true });

    if(!user) {
        res.redirect("/");
    } else {
        const [username, id] = user.split("=");
        res.render("dashboard.html", {name: username, id: id});
    }
});

serveJS.get("/postmsg", (req, res) => {
    const cookie = new Cookies(req, res, {keys});
    const user = cookie.get("user", {signed: true });

    if(user && user.includes(req.query.id)) {
        res.redirect("/");
        return;
    }
    res.render("sendmsg.html", {name: req.query.name, id: req.query.id});
});

serveJS.post("/getmsgs", async (req, res) => {
    console.log(req.body.userId);
    try {
        const msg = await Message.find({userId: req.body.userId}).sort({createAt: -1});
        res.send({success: true, data: msg});
    } catch (err) {
        console.log(err);
        res.send({success: false});
    }
});

serveJS.post("/postmsg", async (req, res) => {
    const cookie = new Cookies(req, res, {keys});
    const user = cookie.get("user", {signed: true });

    const {text, userId} = req.body;
    if(user==userId) {
        res.redirect("/");
        return;
    }

    try {
        const msg = new Message({
            text,
            userId
        });
        await msg.save();
        res.send({success: true});
    } catch (error) {
        console.log(error);
        res.send({success: false});
    }
});

serveJS.get("/logout", (req, res) => {
    const cookie = new Cookies(req, res, {keys});
    destroyCookies(cookie, "user");
    res.redirect("/");
});

// Utilities
function destroyCookies(c, name) {
    c.set(name, {expires: Date.now()});
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function genId(str) {
    str = str.split("");
    let fin = [];
    str.forEach((i, idx) => {
        fin.push(Math.floor(Math.random(233) * (idx + 21)).toString())
    });
    fin = [...fin, ...str];
    fin = (fin.sort((a, b) => randomRange(0, 9) > 5 ? 1 : -1).join(""))
    fin = fin.replace(/\s|=/g, "");
    return fin;
    //     let id = randomRange(0, 9) > 5 ? 1 : -1).join("");
    //     console.log(id);
    //     return id.replaceAll(" ", "").replaceAll("=", "");
    // }
}

const PORT = process.env.PORT || 5000;

serveJS.listen(PORT, () => console.dir(`Server started on port ${PORT}`));  