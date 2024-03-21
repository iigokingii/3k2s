const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session');
const users = require("./users.json");
const app = express();
app.use(session({
    secret: 'SuperSecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


passport.use(new BasicStrategy(verifyUser));
function verifyUser(username, password, done) {
    const user = users.find(user=>user.name===username&& user.password===password)
    //done(null, user) в случае успешной аутентификации
    if(user)
        return done(null,user)
    // Или вызовите done(null, false) в случае неправильных данных
    return done(null,false);
}
app.get('/',(req,res)=>{
    res.redirect('/login');
})
app.get('/login', (req, res) => {
    res.send("<form method='post' action='/login'>" +
        "<div>"+
            "<label>name:</label>"+
            "<input type='text' name='name' required>" +
        "</div>"+
        "<div>"+
            "<label>password:</label>"+
            "<input type='password' name='password' required>" +
        "</div>"+
        "<input type='submit'>" +
        "</form>");
});
app.post("/login", (req, res, next) => {
    passport.authenticate("basic", (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/resource");
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout(()=>{});
    res.redirect('/login');
});
app.get("/resource", (req, resp) => {
    if (req.isAuthenticated()) {
        resp.send(`resource page<br/>Username: ${req.user.name}`);
    } else {
        resp.redirect('/login');
    }
});


app.use((err, req, resp, next) => {
    resp.status(404).send("Not Found");
});
const port = 3000;
app.listen(port, () => {
    console.log(`HTTP Server running at http://127.0.0.1:3000/`);
});