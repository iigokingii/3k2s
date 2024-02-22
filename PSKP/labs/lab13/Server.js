const http = require("http");
const fs = require("fs");
const url = require("url");
const SequelizeRepository = require("./Repository")
const sequelizeRepository = new SequelizeRepository();


http.createServer(async (request,response)=> {
    let path = url.parse(request.url).pathname;
    if((path==="/") && request.method==="GET"){
        let html = fs.readFileSync('./index.html');
        response.writeHead(200,{'Content-type':'text/html; charset=utf-8'});
        response.end(html);
    }
    else if(path==="/api/faculties" && request.method==="GET"){
        let data = await sequelizeRepository.getFaculties()
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path==="/api/teachers" && request.method==="GET"){
        let data = await sequelizeRepository.getTeachers()
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path==="/api/pulpits" && request.method === "GET"){
        let data = await sequelizeRepository.getPulpits();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/subjects" && request.method === "GET"){
        let data = await sequelizeRepository.getSubjects();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/auditoriumstypes" && request.method === "GET"){
        let data = await sequelizeRepository.getAuditoriumsTypes();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/auditoriums" && request.method === "GET"){
        let data = await sequelizeRepository.getAuditoriums();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    // --/api/faculty/xyz/pulpits
    // --/api/faculty/ЛХФ/pulpits
    else if(path.includes("/api/faculty") && request.method === "GET"){
        const segments = path.split('/');
        if(segments.length===5){
            const encodedFacultyCode = segments[3];
            const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
            let data = await sequelizeRepository.getSubjectsByFacultyCode(decodedFacultyCode);
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(data));
        }
    }
    // --/api/auditoriumtypes/xyz/auditoriums
    // --/api/auditoriumtypes/ЛК/auditoriums
    else if(path.includes("/api/auditoriumtypes") && request.method === "GET"){
        const segments = path.split('/');
        if(segments.length===5){
            const encodedFacultyCode = segments[3];
            const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
            let data = await sequelizeRepository.getAuditoriumByAuditoriumType(decodedFacultyCode);
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(data));
        }
    }
    /*
    {
        "FACULTY":"ФИТ",
        "FACULTY_NAME":"ФАКУЛЬТЕТ ИТ"
    }
    */
    else if (path === '/api/faculties' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.AddFaculty(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и сохранены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }
    /*
    {
        "PULPIT":"поит",
        "PULPIT_NAME":"Программное обеспечение информационных технологий",
        "FACULTY":"TEST"
    }
    */
    else if (path === '/api/pulpits' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.AddPulpit(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и сохранены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "SUBJECT":"PSKP",
        "SUBJECT_NAME":"Программирование серверных кросспл приложений",
        "PULPIT":"поит"
    }*/
    else if (path === '/api/subjects' && request.method === 'POST') {
       let body = '';
       request.on('data', (chunk) => {
           body += chunk;
       });
       request.on('end', async () => {
           try {
               const jsonData = JSON.parse(body);
               console.log(jsonData);
               await sequelizeRepository.AddSubject(jsonData);
               response.statusCode = 200;
               response.end('Данные получены и сохранены');
           } catch (error) {
               response.statusCode = 500;
               response.end(error.message);
           }
       });
   }

    /*{
        "TEACHER":"ИВИВИВ",
        "TEACHER_NAME":"ИВАНОВ ИВАН ИВАНОВИЧ",
        "PULPIT":"ЛВ"
    }*/

    else if (path === '/api/teachers' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.AddTeacher(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и сохранены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

   /*{
       "AUDITORIUM_TYPE":"PZ",
       "AUDITORIUM_TYPENAME":"Класс практических занятий"
   }*/
    else if (path === '/api/auditoriumstypes' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.AddAuditoriumType(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и сохранены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }
    /*{
        "AUDITORIUM":"114-2",
        "AUDITORIUM_NAME":"114-2",
        "AUDITORIUM_CAPACITY":"40",
        "AUDITORIUM_TYPE":"ПЗ"
    }*/
    else if (path === '/api/auditoriums' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.AddAuditorium(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и сохранены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*
    {
        "FACULTY":"TEST",
        "FACULTY_NAME":"NEW TEST NAME"
    }
    */
    else if (path === '/api/faculties' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.UpdateFaculty(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "PULPIT":"TEST",
        "PULPIT_NAME":"NEW TEST NAME",
        "FACULTY":"ИДиП"
    }*/
    else if (path === '/api/pulpits' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.UpdatePulpit(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*
    {
        "SUBJECT":"PSKP",
        "SUBJECT_NAME":"ПСКП",
        "PULPIT":"поит"
    }
    */
    else if (path === '/api/subjects' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.UpdateSubject(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "TEACHER":"SS",
        "TEACHER_NAME":"SSSSS SSS SSSS",
        "PULPIT":"ОХ"
    }*/

    else if (path === '/api/teachers' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.UpdateTeacher(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*
    {
        "ADITORIUM_TYPE":"ПЗ",
        "ADITORIUM_TYPENAME":"Класс ПЗ"
    }
    */
    else if (path === '/api/auditoriumstypes' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await sequelizeRepository.UpdateAuditoriumType(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "AUDITORIUM":"114-2",
        "AUDITORIUM_NAME":"114-2",
        "AUDITORIUM_CAPACITY":60,
        "AUDITORIUM_TYPE":"ПЗ"
    }*/
    else if (path === '/auditoriums' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await SequelizeRepository.UpdateAuditorium(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }
    //api/faculties/xyz
    //api/faculties/TEST
    else if(path.includes('api/faculties')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeleteFaculty(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }
    else if(path.includes('api/pulpits')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeletePulpit(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('api/subjects')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeleteSubject(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('api/teachers')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeleteTeacher(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('api/auditoriumstypes')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeleteAuditoriumType(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('api/auditoriums')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await sequelizeRepository.DeleteAuditorium(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }
    else{
        response.statusCode = 400;
        response.end();
    }
}).listen(3000,'127.0.0.1');
console.log('HTTP Server running at http://127.0.0.1:3000/');