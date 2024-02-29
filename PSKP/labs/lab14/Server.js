const http = require("http");
const fs = require("fs");
const url = require("url");
const PrismaRepository = require("./Repository")
const prismaRepository = new PrismaRepository();


http.createServer(async (request,response)=> {
    let path = url.parse(request.url).pathname;
    if((path==="/") && request.method==="GET"){
        let html = fs.readFileSync('./index.html');
        response.writeHead(200,{'Content-type':'text/html; charset=utf-8'});
        response.end(html);
    }
    if(path==="/api/faculties" && request.method==="GET"){
        let data = await prismaRepository.getFaculties()
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path==="/api/teachers" && request.method==="GET"){
        let data = await prismaRepository.getTeachers()
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path==="/api/pulpits" && request.method === "GET"){
        let data = await prismaRepository.getPulpits();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/subjects" && request.method === "GET"){
        let data = await prismaRepository.getSubjects();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/auditoriumstypes" && request.method === "GET"){
        let data = await prismaRepository.getAuditoriumsTypes();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/auditoriums" && request.method === "GET"){
        let data = await prismaRepository.getAuditoriums();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    // --/api/faculty/xyz/pulpits
    // --/api/faculty/ЛХФ/pulpits
    else if(path.includes("/api/faculty") && request.method === "GET"){
        const segments = path.split('/');
        if(segments.length===5 && segments[4]==="pulpits"){
            const encodedFacultyCode = segments[3];
            const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
            let data = await prismaRepository.getPulpitsByFacultyCode(decodedFacultyCode);
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(data));
        }
    }
    // /api/teacherswithfluent/ЛВ
    else if(path.includes("/api/teacherswithfluent") && request.method === "GET"){
        const segments = path.split('/');
        if(segments.length===4){
            const encodedFacultyCode = segments[3];
            const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
            let data = await prismaRepository.GetTeacherByPulpitWithFluentApi(decodedFacultyCode);
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(data));
        }
    }


        // --/api/auditoriumtypes/xyz/auditoriums
    // --/api/auditoriumtypes/ЛБ-К/auditoriums
    else if(path.includes("/api/auditoriumtypes") && request.method === "GET"){
        const segments = path.split('/');
        if(segments.length===5 && segments[4]==="auditoriums"){
            const encodedFacultyCode = segments[3];
            const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
            let data = await prismaRepository.getAuditoriumByAuditoriumType(decodedFacultyCode);
            response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(data));
        }
    }
    else if(path === "/api/auditoriumsWithComp1" && request.method === "GET"){
        let data = await prismaRepository.getAuditoriumsWithComp1();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/puplitsWithoutTeachers" && request.method === "GET"){
        let data = await prismaRepository.getPuplitsWithoutTeachers();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/pulpitsWithVladimir" && request.method === "GET"){
        let data = await prismaRepository.getPuplitsWithVladimir();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/auditoriumsSameCount" && request.method === "GET"){
        let data = await prismaRepository.getAuditoriumsSameCount();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }
    else if(path === "/api/getteachercount" && request.method === "GET"){
        let data = await prismaRepository.getTeacherCount();
        response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify(data));
    }


        /*
        {
        	"faculty": "TestFac",
        	"faculty_name": "TESST",
        	"Pulpit": [
        		{
        			"pulpit": "pulpit1",
        			"pulpit_name": "TEST1"
        		},
        			{
        			"pulpit": "pulpit2",
        			"pulpit_name": "Test2"
        		}
        	]
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
                // console.log(jsonData);
                await prismaRepository.AddFaculty(jsonData);
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
            "pulpit": "avocado5",
            "pulpit_name": "asdaf",
            "faculty": "qwezxc",
            "faculty_name": "ssss"
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
                // console.log(jsonData);
                await prismaRepository.AddPulpit(jsonData);
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
            "subject":"tesst",
            "subject_name":"testing",
            "pulpit":"avocado5"
        }

    */

    else if (path === '/api/subjects' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await prismaRepository.AddSubject(jsonData);
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
        "teacher":"ИВИВИВ",
        "teacher_name":"ИВАНОВ ИВАН ИВАНОВИЧ",
        "pulpit":"ЛВ"
    }
    */

    else if (path === '/api/teachers' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await prismaRepository.AddTeacher(jsonData);
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
        "auditorium_type":"PZ",
        "auditorium_typename":"Класс практических занятий"
    }
    */
    else if (path === '/api/auditoriumstypes' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await prismaRepository.AddAuditoriumType(jsonData);
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
        "auditorium":"114-2",
        "auditorium_name":"114-2",
        "auditorium_capacity":"40",
        "auditorium_type":"ПЗ"
    }
    */
    else if (path === '/api/auditoriums' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await prismaRepository.AddAuditorium(jsonData);
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
        "faculty":"TEST",
        "faculty_name":"NEW TEST NAME"
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
                await prismaRepository.UpdateFaculty(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "pulpit":"TEST",
        "pulpit_name":"NEW TEST NAME",
        "faculty":"ИДиП"
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
                await prismaRepository.UpdatePulpit(jsonData);
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
        "subject":"PSKP",
        "subject_name":"ПСКП",
        "pulpit":"поит"
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
                await prismaRepository.UpdateSubject(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "teacher":"SS",
        "teacher_name":"SSSSS SSS SSSS",
        "pulpit":"ОХ"
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
                await prismaRepository.UpdateTeacher(jsonData);
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
        "auditorium_type":"ПЗ",
        "auditorium_typename":"Класс ПЗ"
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
                await prismaRepository.UpdateAuditoriumType(jsonData);
                response.statusCode = 200;
                response.end('Данные получены и Обновлены');
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        });
    }

    /*{
        "auditorium":"114-2",
        "auditorium_name":"114-2",
        "auditorium_capacity":60,
        "auditorium_type":"ПЗ"
    }*/
    else if (path === '/api/auditoriums' && request.method === 'PUT') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', async () => {
            try {
                const jsonData = JSON.parse(body);
                console.log(jsonData);
                await prismaRepository.UpdateAuditorium(jsonData);
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
    else if(path.includes('/api/faculties')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeleteFaculty(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }
    //api/pulpits/TEST
    else if(path.includes('/api/pulpits')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeletePulpit(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('/api/subjects')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeleteSubject(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('/api/teachers')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeleteTeacher(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('/api/auditoriumstypes')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeleteAuditoriumType(decodedFacultyCode);
                response.writeHead(200, {"Content-type": "text/plain"});
                response.end("Данные удалены");
            } catch (error) {
                response.statusCode = 500;
                response.end(error.message);
            }
        }
    }

    else if(path.includes('/api/auditoriums')&&request.method==="DELETE"){
        const segments = path.split('/');
        if(segments.length===4){
            try {
                const encodedFacultyCode = segments[3];
                const decodedFacultyCode = decodeURIComponent(encodedFacultyCode);
                let data = await prismaRepository.DeleteAuditorium(decodedFacultyCode);
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