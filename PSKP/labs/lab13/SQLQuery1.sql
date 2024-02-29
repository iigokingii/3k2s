select * from faculty full outer join pulpit on faculty.faculty = pulpit.faculty;
select *from FACULTY;
select *from TEACHER;
SELECT *FROM PULPIT;
select *from AUDITORIUM_type;
SELECT *FROM AUDITORIUM;

select *from faculty inner join pulpit on faculty.faculty = pulpit.faculty;

SELECT COUNT(*)[йнкбн опеонднб],TEACHER.PULPIT FROM PULPIT INNER JOIN TEACHER ON TEACHER.PULPIT = PULPIT.PULPIT GROUP BY TEACHER.PULPIT;