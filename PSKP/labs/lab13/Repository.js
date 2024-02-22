const {
    Faculty,
    Pulpit,
    Teacher,
    Subject,
    AuditoriumType,
    Auditorium
} = require('./Entities.js');


class SequelizeRepository{
    async getFaculties() {
        return await Faculty.findAll();
    }
    async getPulpits(){
        return await Pulpit.findAll();
    }
    async getSubjects(){
        return await Subject.findAll();
    }
    async getTeachers(){
        return await Teacher.findAll();
    }
    async getAuditoriumsTypes(){
        return await AuditoriumType.findAll();
    }
    async getAuditoriums(){
        return await Auditorium.findAll();
        //return await Auditorium.scope('capacityRange').findAll();
    }
    async getSubjectsByFacultyCode(decodedFacultyCode){
        return await Faculty.findAll({
            where: { faculty: decodedFacultyCode },
            include: {
                model: Pulpit,
                attributes: ['PULPIT', 'PULPIT_NAME']
            },
        })
    }

    async getAuditoriumByAuditoriumType(decodedFacultyCode){
        return await AuditoriumType.findAll({
            where: { AUDITORIUM_TYPE: decodedFacultyCode },
            include: {
                model: Auditorium,
                attributes: ['AUDITORIUM', 'AUDITORIUM_NAME','AUDITORIUM_CAPACITY','AUDITORIUM_TYPE']
            },
        })
    }
    async AddPulpit(jsonData){
        await Pulpit.create(jsonData);
    }
    async AddFaculty(jsonData){
        await Faculty.create(jsonData);
    }
    async AddSubject(jsonData){
        await Subject.create(jsonData);
    }
    async AddTeacher(jsonData){
        await Teacher.create(jsonData);
    }
    async AddAuditoriumType(jsonData){
        await AuditoriumType.create(jsonData);
    }
    async AddAuditorium(jsonData){
        await Auditorium.create(jsonData);
    }
    async UpdateFaculty(jsonData){
        await Faculty.update(jsonData, { where: { FACULTY: jsonData.FACULTY } });
    }
    async UpdatePulpit(jsonData){
        await Pulpit.update(jsonData, { where: { PULPIT: jsonData.PULPIT } })
    }
    async UpdateSubject(jsonData){
        await Subject.update(jsonData, { where: { SUBJECT: jsonData.SUBJECT } });
    }
    async UpdateTeacher(jsonData){
        await Teacher.update(jsonData, { where: { TEACHER: jsonData.TEACHER } });
    }
    async UpdateAuditoriumType(jsonData){
        await AuditoriumType.update(jsonData, { where: { AUDITORIUM_TYPE: jsonData.AUDITORIUM_TYPE } });
    }
    async UpdateAuditorium(jsonData){
        await Auditorium.update(jsonData, { where: { AUDITORIUM: jsonData.AUDITORIUM } });
    }
    async DeleteFaculty(decodedFacultyCode){
        await Faculty.destroy({ where: { FACULTY: decodedFacultyCode } });
    }
    async DeletePulpit(decodedFacultyCode){
        await Pulpit.destroy({ where: { PULPIT: decodedFacultyCode } });
    }
    async DeleteSubject(decodedFacultyCode){
        await Subject.destroy({ where: { SUBJECT: decodedFacultyCode } });
    }
    async DeleteTeacher(decodedFacultyCode){
        await Teacher.destroy({ where: { TEACHER: decodedFacultyCode } });
    }
    async DeleteAuditoriumType(decodedFacultyCode){
        await AuditoriumType.destroy({ where: { AUDITORIUM_TYPE: decodedFacultyCode } });
    }
    async DeleteAuditorium(decodedFacultyCode){
        await Auditorium.destroy({ where: { AUDITORIUM: decodedFacultyCode } });
    }


}

module.exports = SequelizeRepository;
