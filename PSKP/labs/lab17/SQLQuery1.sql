CREATE TABLE USERS_DB_FOR_LAB(
	USER_ID CHAR(10),
	USERNAME NVARCHAR(50),
	PASSWORD NVARCHAR(50)
);
DROP TABLE USERS_DB_FOR_LAB;
INSERT INTO USERS_DB_FOR_LAB VALUES('TESTNAME','1');
commit;
select* from USERS_DB_FOR_LAB