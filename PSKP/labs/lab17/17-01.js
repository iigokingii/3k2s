const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const users = require("./users.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "SuperSeckretKeyForLab17",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
    new localStrategy((username, password, done) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: "Неправильный логин или пароль" });
    })
);

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});

app.post("/login",
    passport.authenticate("local", {
        successRedirect: "/resource",
        failureRedirect: "/login"
    })
);

app.get("/resource", (req, resp) => {
    if (req.isAuthenticated()) {
        resp.send(`<h1>resource page</h1><h2>Username: ${req.user.username}</h2>`);
    } else {
        resp.redirect('/login');
    }
});

app.get("/logout", (req, resp) => {
    req.logout(()=>{});
    resp.redirect('/login');
});

app.use((err, req, resp, next) => {
    resp.status(404).send("Not Found");
});

const port = 3000;
app.listen(port, () => {
    console.log(`HTTP Server running at http://127.0.0.1:${port}/login`);
});