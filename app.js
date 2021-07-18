const serveJS = require("serve-dot-js");
const path = require("path");
const Cookies = require("cookies");
const { Server } = require("http");

const keys = ["secret"];

serveJS.setStatic(path.join(__dirname, "views"));
serveJS.setView(path.join(__dirname, "views"));
serveJS.use(serveJS.json());

serveJS.get("/", (req, res) => {
    // return home page
    const cookie = new Cookies(req, res, {keys});
    const loggedIn = cookie.get("logged_info", {signed: true });
    
    if (!loggedIn) {    // First time visiting
        cookie.set('logged_info', "TRUE", { signed: true });
        res.render("index.html");
    } else {    // Already a user, return dashboard
        res.redirect("/dashboard");
    }
});

serveJS.post("/", (req, res) => {
    // redirect to dashboard passing its special link
    console.log(req.body);
    res.redirect("/dashboard");
});
serveJS.get("/dashboard", (req, res) => {
    // return dashboard page
    const cookie = new Cookies(req, res, {keys});
    const loggedIn = cookie.get("logged_info", {signed: true });

    if(!loggedIn) {
        res.redirect("/");
    } else {
        res.render("dashboard.html", {name: "John"});
    }
});

serveJS.get("/postmsg", (req, res) => {
    // recieve and store the anonymous message
    // console.log(req.body);
    // res.send({...req.body});
    res.render("sendmsg.html", {name: "John"});
});

// Utilities
function destroyCookies(c, name) {
    c.set(name, {expires: Date.now()});
}

const PORT = process.env.PORT || 5000;

serveJS.listen(PORT, () => console.dir(`Server started on port ${PORT}`));  