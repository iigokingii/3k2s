const express = require("express");
const bodyParser = require('body-parser');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const {Users,sequelize} = require('./Sequelize')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    if (req.cookies.accessToken) {
        jwt.verify(req.cookies.accessToken, "accessToken", (err, user) => {
            if (err) next();
            else if (user) {
                req.user = user;
                next();
            }
        });
    } else next();
});

const redisClient = redis.createClient();

app.get('/registration', (req, res) => {
    console.log('[REGISTRATION]# GET');
    res.sendFile(__dirname + '/static/registration.html');
});

app.post('/registration', async (req, res) => {
    const us = await Users.findOne({
        where: {
            USERNAME: req.body.username,
        },
    });
    if (us) res.redirect('/login');
    else {
        await Users.create({
            USERNAME: req.body.username,
            PASSWORD: req.body.password,
        });
        res.redirect('/login');
    }
});


app.get('/logout', (req, res) => {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.redirect('/login');
});

app.get('/resource', async (req, res) => {
    if (req.user) {
        const userId = req.user.id;
        const refreshToken = req.cookies.refreshToken;
        try {
            const isBlack = await redisClient.get(refreshToken);
            if (isBlack) {
                return res.status(401).send('Refresh token is in the blacklist');
            }
        } catch (error) {
            console.error('Error accessing Redis:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send(`resource userId:${userId} name:${req.user.name}`);
    } else {
        res.status(401).send('Log in or Registrate before.');
    }
});


app.get('/refresh-token', async (req, res) => {
    if (req.cookies.refreshToken) {
        jwt.verify(req.cookies.refreshToken, "refreshToken", async (err, user) => {
            if (err) console.log(err.message);
            else if (user) {
                const userId = user.id;
                const refreshToken = req.cookies.refreshToken;

                const IsBlack = await redisClient.get(refreshToken);
                if(IsBlack)
                    res.status(401).send('Refresh token is in the blacklist');
                else{
                    const us = await Users.findOne({
                        where: {
                            USER_ID: userId,
                        },
                    });
                    const newAccessToken = jwt.sign(
                        { id: us.USER_ID, name: us.USERNAME },
                        "accessToken",
                        { expiresIn: 10 * 60 }
                    );

                    // Генерация нового refresh token
                    const newRefreshToken = jwt.sign(
                        { id: us.USER_ID, name: us.USERNAME },
                        "refreshToken",
                        { expiresIn: 24 * 60 * 60 }
                    );
                    console.log('[/REFRESH-TOKEN]# NEW REFRESH AND ACCESS TOKENS WERE GENERATED.');
                    res.clearCookie('accessToken');
                    res.clearCookie('refreshToken');
                    console.log('[/REFRESH-TOKEN]# OLD REFRESH AND ACCESS TOKENS WERE DELETED FROM COOKIES');

                    await redisClient.set(refreshToken,`USER:${userId}`);
                    const keys = await redisClient.keys(refreshToken);

                    const results = await Promise.all(keys.map(async key => {
                        const value = await redisClient.get(key);
                        return { key, value };
                    }));

                    const result = await redisClient.get(refreshToken);

                    console.log('Refresh token is in the blacklist', result);

                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                    });
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                    });

                    res.redirect('/resource');
                }

            } else {
                res.status(401).send('Token is invalid');
            }
        });
    } else {
        res.status(401).send('Token is invalid');
    }
});

app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const us = await Users.findOne({
            where: {
                USERNAME: username,
                PASSWORD: password
            },
        });
        if (us) {
            const accessToken = jwt.sign({ id: us.USER_ID, name: us.USERNAME }, "accessToken", {
                expiresIn: 10 * 60,
            });
            const refreshToken = jwt.sign(
                { id: us.USER_ID, name: us.USERNAME },
                "refreshToken",
                {
                    expiresIn: 24 * 60 * 60,
                }
            );

            console.log('[/LOGIN]# NEW REFRESH AND ACCESS TOKENS WERE GENERATED.');

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.redirect('/resource');
        } else {
            res.redirect('/login');
        }
    }
    catch (ex){
        console.log(ex.message());
    }


});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});

app.use((err, req, resp, next) => {
    resp.status(404).send("Not Found");
});
const port = 3000;
app.listen(port, async () => {
    console.log(`HTTP Server running at http://127.0.0.1:${port}/login`);
    redisClient.connect().then(async () => {
        console.log('connected to the Redis');
    }).catch((err) => {
        console.log('connection error Redis:', err);
    });
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
