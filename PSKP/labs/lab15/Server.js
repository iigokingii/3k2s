const express = require('express');
const handlebar = require('express-handlebars');
const path = require('path');
const hbs     = require('hbs');
const fs = require('fs')


const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
const PATH_JSON = path.join(__dirname, 'DB.json');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("CreateDeclineButton", function(){
    let button = document.createElement("button");
    button.className = "updated-button";
    button.id = "declineButton";
    button.innerText = "Отказаться";
    document.body.appendChild(button);
});

let users = [];

app.get('/', (req, res) => {
    fs.readFile(PATH_JSON, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error while reading the file:', err);
            return;
        }
        try {
            users = JSON.parse(fileData);
            res.render('handbook',{
                users:users,
                clicked:false,
                disabled:false
            });
            console.log(users);
        } catch (err) {
            console.error('Error while parsing JSON data:', err);
        }
    });
});

app.get('/adduser', (req, res) => {
    fs.readFile(PATH_JSON, 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error while reading the file:', err);
            return;
        }
        try {
            const users = JSON.parse(fileData);
            res.render('handbook',{
                users:users,
                clicked:true,
                disabled:true
            });
            console.log(users);
        } catch (err) {
            console.error('Error while parsing JSON data:', err);
        }
    });
});

app.get('/updateuser',(request,response)=>{
    const id = request.query.id;
    const numberStr = id.replace('`', '');
    const intId = parseInt(numberStr);
    let user = users[intId];
    response.render('handbookupdate',{
        users:users,
        user:user
    });
})

app.post('/adduser', (request, response) => {
    let body = '';
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', async () => {
        try {
            const jsonDataReq = JSON.parse(body);

            const newUser = {
                id:users.length,
                fio:jsonDataReq.fio,
                phone:jsonDataReq.phone
            }
            users.push(newUser);
            const jsonData = JSON.stringify(users, null, 2);

            fs.writeFile('./DB.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('Ошибка записи в файл:', err);
                } else {
                    console.log('Запись успешно добавлена в файл.');
                    response.statusCode = 200;
                    response.end('Данные получены и сохранены');
                }
            });
        } catch (error) {
            response.statusCode = 500;
            response.end(error.message);
        }
    });

});



app.post('/updateuser',(request,response)=>{
    let body = '';
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', async () => {
        try {
            const jsonDataReq = JSON.parse(body);

            const updatedUser = {
                id:jsonDataReq.id,
                fio:jsonDataReq.fio,
                phone:jsonDataReq.phone
            }

            users[jsonDataReq.id] = updatedUser;
            const jsonData = JSON.stringify(users, null, 2);

            fs.writeFile('./DB.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('Ошибка записи в файл:', err);
                } else {
                    console.log('Запись успешно добавлена в файл.');
                    response.statusCode = 200;
                    response.end('Данные получены и сохранены');
                }
            });
        } catch (error) {
            response.statusCode = 500;
            response.end(error.message);
        }
    });
})

app.delete('/deleteuser',(request,response)=>{
    let body = '';
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', async () => {
        try {
            const jsonDataReq = JSON.parse(body);
            const id = parseInt(jsonDataReq.id);
            users.splice(id,id);
            const jsonData = JSON.stringify(users, null, 2);
            fs.writeFile('./DB.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('Ошибка записи в файл:', err);
                } else {
                    console.log('Запись успешно добавлена в файл.');
                    response.statusCode = 200;
                    response.end('Данные получены и сохранены');
                }
            });
        } catch (error) {
            response.statusCode = 500;
            response.end(error.message);
        }
    });
})


const port = 3000;
app.listen(port, () => {
    console.log(`HTTP Server running at http://127.0.0.1:3000/`);
});
