const { PrismaClient } = require('@prisma/client');
const {Faculty, Pulpit, Subject, Teacher, AuditoriumType, Auditorium} = require("../lab13/Entities");
const {json} = require("sequelize");

const prisma = new PrismaClient();
class PrismaRepository {
    async getFaculties() {
        return await prisma.Faculty.findMany();
    }
    async getTeachers() {
        return await prisma.Teacher.findMany();
    }
    async getSubjects() {
        return await prisma.Subject.findMany();
    }
    async getPulpits() {
        return await prisma.Pulpit.findMany();
    }
    async getTeacherCount(){
        return await prisma.Teacher.groupBy({
            by: ["pulpit"],
            _count: { _all: true },
        });
    }
    async getAuditoriumsTypes() {
        return await prisma.AuditoriumType.findMany();
    }
    async getAuditoriums() {
        return await prisma.Auditorium.findMany();
    }
    async getPulpitsByFacultyCode(xyz){
        return await prisma.Faculty.findMany({
            where: { faculty: xyz },
            select: {
                faculty: true,
                Pulpit: {
                    select: {
                        pulpit: true,
                        Subject: { select: { subject_name: true } }
                    }
                }
            }
        })
    }
    async getAuditoriumByAuditoriumType(xyz){
        return await prisma.AuditoriumType.findMany({
            where: { auditorium_type: xyz },
            select: {
                auditorium_type: true,
                Auditorium: { select: { auditorium: true } }
            }
        })
    }
    async getAuditoriumsWithComp1(){
        return await prisma.Auditorium.findMany({
            where: {
                //auditorium_type: 'ЛБ-К',
                auditorium: { contains: '-1' }
            },
        });
    }
    async getPuplitsWithoutTeachers(){
        return await prisma.Pulpit.findMany({
            where: {
                Teacher: { none: {} }
            }
        });
    }
    async getPuplitsWithVladimir(){
        return await prisma.Pulpit.findMany({
            where: {
                Teacher: {
                    some: {
                        teacher_name: { contains: 'Владимир' }
                    }
                }
            },
            select: {
                pulpit: true,
                pulpit_name: true,
                Teacher: {
                    select: {
                        teacher_name: true
                    }
                }
            }
        });
    }
    async getAuditoriumsSameCount(){
        return await prisma.Auditorium.groupBy({
            by: ['auditorium_capacity', 'auditorium_type'],
            _count: { auditorium: true },
            having: {
                auditorium: {
                    _count: { gt: 1 }
                }
            }
        });
    }
    async AddFaculty(jsonData){
        const facultyExists = await prisma.Faculty.findFirst({ where: { faculty:jsonData.faculty } });
        if (facultyExists)
            throw new Error("Faculty PK Exception");
        if(jsonData.Pulpit!==undefined){
            const existingPulpits = await prisma.pulpit.findMany({
                where: {
                    OR: jsonData.Pulpit.map((pulpitData) => ({
                        pulpit: pulpitData.pulpit,
                    })),
                },
            });
            if (existingPulpits.length !== 0) {
                throw new Error("Pulpit PK Exception");
            }
            return await prisma.Faculty.create({
                data: {
                    faculty:jsonData.faculty,
                    faculty_name:jsonData.faculty_name,
                    Pulpit: {
                        createMany: {
                            data: jsonData.Pulpit.map(pulpitData => ({
                                pulpit: pulpitData.pulpit,
                                pulpit_name: pulpitData.pulpit_name
                            }))
                        }
                    }
                },
                include: {
                    Pulpit: true
                }
            });
        }
        return await prisma.Faculty.create({
            data: {
                faculty: jsonData.faculty,
                faculty_name: jsonData.faculty_name
            }

        });



    };
    async AddPulpit(jsonData){
        const pulpitExists = await prisma.Pulpit.findFirst({ where: { pulpit:jsonData.pulpit } });
        if (pulpitExists)
            throw new Error("Pulpit PK Exception");

        return await prisma.Pulpit.create({
            data: {
                pulpit:jsonData.pulpit,
                pulpit_name:jsonData.pulpit_name,
                Faculty: {
                    connectOrCreate: {
                        where: { faculty:jsonData.faculty },
                        create: {
                            faculty:jsonData.faculty,
                            faculty_name:jsonData.faculty_name
                        }
                    }
                }
            },
            select: {
                pulpit: true,
                pulpit_name: true,
                Faculty: true
            }
        });
    };
    async AddSubject(jsonData){
        const subjectExists = await prisma.subject.findFirst({ where: { subject:jsonData.subject } });
        if (subjectExists)
            throw new Error("Subject PK Exception");
        return await prisma.Subject.create({
            data: {
                subject: jsonData.subject,
                subject_name: jsonData.subject_name,
                pulpit: jsonData.pulpit
            }
        });
    }
    async AddTeacher(jsonData){
        const teacherExists = await prisma.teacher.findFirst({ where: { teacher:jsonData.teacher } });
        if (teacherExists)
            throw new Error("Teacher PK Exception");
        return await prisma.Teacher.create({
            data: {
                teacher:jsonData.teacher,
                teacher_name:jsonData.teacher_name,
                pulpit:jsonData.pulpit
            }
        })
    }
    async AddAuditoriumType(jsonData){
        const typeExists = await prisma.AuditoriumType.findFirst({ where: { auditorium_type:jsonData.auditorium_type } });

        if (typeExists)
            throw new Error("Auditorium type PK Exception");

        return await prisma.AuditoriumType.create({
            data: {
                auditorium_type:jsonData.auditorium_type,
                auditorium_typename:jsonData.auditorium_typename
            }
        })
    }

    async AddAuditorium(jsonData){
        const auditoriumExists = await prisma.auditorium.findFirst({ where: { auditorium:jsonData.auditorium } });
        if (auditoriumExists)
            throw new Error("Auditorium PK Error");
        return await prisma.Auditorium.create({
            data: {
                auditorium:jsonData.auditorium,
                auditorium_name:jsonData.auditorium_name,
                auditorium_capacity:jsonData.auditorium_capacity,
                auditorium_type:jsonData.auditorium_type
            }
        })
    }

    async UpdateFaculty(jsonData){
        const facultyToUpdate = await prisma.faculty.findUnique({ where: { faculty:jsonData.faculty } });
        if (!facultyToUpdate)
            throw new Error("Cann't find such faculty");
        return await prisma.Faculty.update({
            where: { faculty:jsonData.faculty },
            data: { faculty_name:jsonData.faculty_name }
        })
    }
    async UpdatePulpit(jsonData){
        const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit:jsonData.pulpit } });
        const facultyToUpdate = await prisma.faculty.findUnique({ where: { faculty:jsonData.faculty } });

        if (!pulpitToUpdate)
            throw new Error("Can't find pulpit");
        else if (!facultyToUpdate)
            throw new Error("Can't find faculty");

        return await prisma.Pulpit.update({
            where: { pulpit:jsonData.pulpit },
            data: {
                pulpit_name:jsonData.pulpit_name,
                faculty:jsonData.faculty
            }
        })
    }
    async UpdateSubject(jsonData){
        const subjectToUpdate = await prisma.subject.findUnique({ where: { subject:jsonData.subject } });
        const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit:jsonData.pulpit } });

        if (!subjectToUpdate)
            throw new Error( `Cannot find subject`);
        else if (!pulpitToUpdate)
            throw new Error(`Cannot find pulpit`);

        return await prisma.Subject.update({
            where: { subject:jsonData.subject },
            data: {
                subject_name:jsonData.subject_name,
                pulpit:jsonData.pulpit
            }
        })
    }
    async UpdateTeacher(jsonData){
        const teacherToUpdate = await prisma.teacher.findUnique({ where: { teacher:jsonData.teacher } });
        const pulpitToUpdate = await prisma.pulpit.findUnique({ where: { pulpit:jsonData.pulpit } });

        if (!teacherToUpdate)
            throw new Error(`Cannot find teacher`);
        else if (!pulpitToUpdate)
            throw new Error(`Cannot find pulpit`);

        return await prisma.Teacher.update({
            where: { teacher:jsonData.teacher },
            data: {
                teacher_name:jsonData.teacher_name,
                pulpit:jsonData.pulpit
            }
        })
    }
    async UpdateAuditoriumType(jsonData){
        const typeToUpdate = await prisma.AuditoriumType.findUnique({ where: { auditorium_type:jsonData.auditorium_type } });
        if (!typeToUpdate)
            throw new Error(`Cannot find auditorium_type`);
        return await prisma.AuditoriumType.update({
            where: { auditorium_type:jsonData.auditorium_type },
            data: { auditorium_typename:jsonData.auditorium_typename }
        })
    }
    async UpdateAuditorium(jsonData){
        const auditoriumToUpdate = await prisma.auditorium.findUnique({ where: { auditorium:jsonData.auditorium } });
        const typeToUpdate = await prisma.AuditoriumType.findUnique({ where: { auditorium_type:jsonData.auditorium_type } });

        if (!auditoriumToUpdate)
            throw new Error(`Cannot find auditorium`);
        else if (!typeToUpdate)
            throw new Error(`Cannot find auditorium_type`);

        return await prisma.auditorium.update({
            where: { auditorium:jsonData.auditorium },
            data: {
                auditorium_name:jsonData.auditorium_name,
                auditorium_capacity:jsonData.auditorium_capacity,
                auditorium_type:jsonData.auditorium_type
            }
        })
    }


    async DeleteFaculty(decodedFacultyCode){
        const facultyToDelete = await prisma.faculty.findUnique({ where: { faculty: decodedFacultyCode } });
        if (!facultyToDelete)
            throw new Error(`Cannot find faculty`);
        return await prisma.Faculty.delete({ where: { faculty: decodedFacultyCode } });
    }
    async DeletePulpit(decodedFacultyCode){
        const pulpitToDelete = await prisma.pulpit.findUnique({ where: { pulpit: decodedFacultyCode } });
        if (!pulpitToDelete)
            throw new Error(`Cannot find pulpit`);
        return await prisma.Pulpit.delete({ where: { pulpit: decodedFacultyCode } })
    }
    async DeleteSubject(decodedFacultyCode){
        const subjectToDelete = await prisma.subject.findUnique({ where: { subject: decodedFacultyCode } });
        if (!subjectToDelete)
            throw new Error(`Cannot find subject`);
        return await prisma.Subject.delete({ where: { subject: decodedFacultyCode } })
    }
    async DeleteTeacher(decodedFacultyCode){
        const teacherToDelete = await prisma.teacher.findUnique({ where: { teacher: decodedFacultyCode } });
        if (!teacherToDelete)
            throw new Error(`Cannot find teacher`);
        return await prisma.Teacher.delete({ where: { teacher: decodedFacultyCode } });
    }
    async DeleteAuditoriumType(decodedFacultyCode){
        const auditoriumToDelete = await prisma.auditorium.findUnique({
            where: { auditorium: decodedFacultyCode }
        });
        if (!auditoriumToDelete)
            throw new Error("Such Auditorium type doesn't exist");

        return await prisma.AuditoriumType.delete({ where: { auditorium_type: decodedFacultyCode } });
    }
    async DeleteAuditorium(decodedFacultyCode){
        const auditoriumToDelete = await prisma.auditorium.findUnique({
            where: { auditorium: decodedFacultyCode }
        });
        if (!auditoriumToDelete)
            throw new Error(`Cannot find auditorium `);
        return await prisma.Auditorium.delete({ where: { auditorium: decodedFacultyCode } })
    }

    async GetTeacherByPulpitWithFluentApi(pulpit_id){
        return await prisma.Pulpit.findUnique({
            where: {pulpit:pulpit_id}
        }).Teacher();
    }








}

module.exports = PrismaRepository;
