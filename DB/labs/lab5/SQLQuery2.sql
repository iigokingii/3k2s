--#1
set language english;

INSERT INTO USERS 
	VALUES('IVAN','IVANOV','IVAN.IVANOV@mail.ru');

INSERT INTO USERS 
	VALUES('kirill','makrush','kirill.makrush@mail.ru');

INSERT INTO USERS 
	VALUES('ilya','semkin','ilya.semkin@mail.ru');

INSERT INTO USERS (USER_NAME, USER_SURNAME, USER_EMAIL)
VALUES
  ('John', 'Doe', 'john.doe@example.com'),
  ('Jane', 'Smith', 'jane.smith@example.com'),
  ('Michael', 'Johnson', 'michael.johnson@example.com'),
  ('Emily', 'Williams', 'emily.williams@example.com'),
  ('David', 'Brown', 'david.brown@example.com'),
  ('Olivia', 'Taylor', 'olivia.taylor@example.com'),
  ('Daniel', 'Anderson', 'daniel.anderson@example.com'),
  ('Sophia', 'Thomas', 'sophia.thomas@example.com'),
  ('Matthew', 'Martinez', 'matthew.martinez@example.com'),
  ('Isabella', 'Hernandez', 'isabella.hernandez@example.com'),
  ('William', 'Lopez', 'william.lopez@example.com'),
  ('Ava', 'Gonzalez', 'ava.gonzalez@example.com'),
  ('James', 'Wilson', 'james.wilson@example.com'),
  ('Mia', 'Anderson', 'mia.anderson@example.com'),
  ('Benjamin', 'Moore', 'benjamin.moore@example.com'),
  ('Charlotte', 'Lee', 'charlotte.lee@example.com'),
  ('Alexander', 'Clark', 'alexander.clark@example.com'),
  ('Ella', 'Lewis', 'ella.lewis@example.com');

INSERT INTO USERS (USER_NAME, USER_SURNAME, USER_EMAIL)
	VALUES
		('Liam', 'Smith', 'liam.smith@example.com'),
		('Emma', 'Johnson', 'emma.johnson@example.com'),
		('Noah', 'Williams', 'noah.williams@example.com'),
		('Olivia', 'Brown', 'olivia.brown@example.com'),
		('Sophia', 'Taylor', 'sophia.taylor@example.com'),
		('Jackson', 'Anderson', 'jackson.anderson@example.com'),
		('Aiden', 'Thomas', 'aiden.thomas@example.com'),
		('Lucas', 'Martinez', 'lucas.martinez@example.com'),
		('Avery', 'Hernandez', 'avery.hernandez@example.com'),
		('Ethan', 'Lopez', 'ethan.lopez@example.com'),
		('Harper', 'Gonzalez', 'harper.gonzalez@example.com'),
		('Madison', 'Wilson', 'madison.wilson@example.com');

INSERT INTO SOFTWARE 
	VALUES ('Microsoft Office', '2021', 'Microsoft Corporation',1);

INSERT INTO SOFTWARE 
	VALUES ('Microsoft Word', '2021', 'Microsoft Corporation',1);

INSERT INTO SOFTWARE 
	VALUES ('Visual Studio Code', '1.55.2', 'Microsoft Corporation',6);

INSERT INTO SOFTWARE 
	VALUES ('Visual Studio', '1.21.2', 'Microsoft Corporation',6);

INSERT INTO SOFTWARE 
	VALUES ('Adobe Photoshop', 'CC 2022', 'Adobe Inc.',2);

INSERT INTO SOFTWARE 
	VALUES ('Adobe Illustrator', 'CC 2022', 'Adobe Inc.',2);

INSERT INTO SOFTWARE 
	VALUES ('Google Chrome', '89.0.4389.82', 'Google LLC',3);

INSERT INTO SOFTWARE 
	VALUES ('MySQL Server', '8.0.23', 'Oracle Corporation',4);

INSERT INTO SOFTWARE
	VALUES ('Oracle Database', '19c', 'Oracle Corporation',4);

INSERT INTO SOFTWARE_TYPE 
	VALUES ('Office Suite', 'Comprehensive productivity software', 1);

INSERT INTO SOFTWARE_TYPE 
	VALUES ('Image Editing', 'Professional image editing software', 2);

INSERT INTO SOFTWARE_TYPE 
	VALUES ('Web Browser', 'Internet browsing application', 3);

INSERT INTO SOFTWARE_TYPE
	VALUES ('Database Management System', 'Relational database management system', 4);

INSERT INTO SOFTWARE_TYPE
	VALUES ('IDE', 'Integrated Development Environment', 3);

INSERT INTO PRICE (PRICE_MONTH, PRICE_QUARTER, PRICE_SIX_MONTH, PRICE_YEAR)
	VALUES (15, 40, 70, 120);

INSERT INTO PRICE (PRICE_MONTH, PRICE_QUARTER, PRICE_SIX_MONTH, PRICE_YEAR)
	VALUES (20, 55, 90, 160);

INSERT INTO PRICE (PRICE_MONTH, PRICE_QUARTER, PRICE_SIX_MONTH, PRICE_YEAR)
	VALUES (0, 0, 0, 0);

INSERT INTO PRICE (PRICE_MONTH, PRICE_QUARTER, PRICE_SIX_MONTH, PRICE_YEAR)
	VALUES (10, 25, 45, 80);

INSERT INTO LICENSES VALUES(1,1,'2021-06-11','2021-07-11');
INSERT INTO LICENSES VALUES(1,1,'2021-07-12','2021-08-12');

INSERT INTO LICENSES VALUES(2,2,'2021-06-11','2021-07-11');
INSERT INTO LICENSES VALUES(3,2,'2021-07-12','2021-08-12');

--2
--3
	SELECT SOFTWARE_TYPE, SUM(PRICE_MONTH) AS TOTAL_MONTHLY_PRICE, SUM(PRICE_QUARTER) AS TOTAL_QUARTERLY_PRICE, SUM(PRICE_SIX_MONTH) AS TOTAL_SIX_MONTH_PRICE, SUM(PRICE_YEAR) AS TOTAL_YEARLY_PRICE 
		FROM SOFTWARE 
			INNER JOIN SOFTWARE_TYPE
				ON SOFTWARE.SOFTWARE_TYPE_ID = SOFTWARE_TYPE.SOFTWARE_TYPE_ID
					INNER JOIN PRICE 
						ON SOFTWARE_TYPE.PRICE_ID = PRICE.PRICE_ID
							GROUP BY (SOFTWARE_TYPE);

--4
	SELECT
		t.SOFTWARE_ID,
		t.NUMBER_OF_LICENSE,
		t.PRICE_MONTH,
		t.PRICE_QUARTER,
		t.PRICE_SIX_MONTH,
		t.PRICE_YEAR,
		t.PERCENTAGE_OF_LICENSE,
		t.TOTAL_ALL_LICENSES,
		t.TOTAL_ALL_LICENSE_COST,
		(t.TOTAL_LICENSE_COST * 100.0 / t.TOTAL_ALL_LICENSE_COST) AS PERCENTAGE_OF_COST
	FROM (
		SELECT
			l.SOFTWARE_ID,
			COUNT(l.SOFTWARE_ID) AS NUMBER_OF_LICENSE,
			SUM(p.PRICE_MONTH) AS PRICE_MONTH,
			SUM(p.PRICE_QUARTER) AS PRICE_QUARTER,
			SUM(p.PRICE_SIX_MONTH) AS PRICE_SIX_MONTH,
			SUM(p.PRICE_YEAR) AS PRICE_YEAR,
			(COUNT(l.SOFTWARE_ID) * 100.0 / (SELECT COUNT(LICENSE_ID) FROM LICENSES)) AS PERCENTAGE_OF_LICENSE,
			(SELECT COUNT(LICENSE_ID) FROM LICENSES) AS TOTAL_ALL_LICENSES,
			(SELECT SUM(p.PRICE_MONTH + p.PRICE_QUARTER + p.PRICE_SIX_MONTH + p.PRICE_YEAR) FROM LICENSES
			 JOIN SOFTWARE ON LICENSES.SOFTWARE_ID = SOFTWARE.SOFTWARE_ID
			 JOIN SOFTWARE_TYPE ON SOFTWARE.SOFTWARE_TYPE_ID = SOFTWARE_TYPE.SOFTWARE_TYPE_ID
			 JOIN PRICE p ON SOFTWARE_TYPE.PRICE_ID = p.PRICE_ID) AS TOTAL_ALL_LICENSE_COST,
			SUM(p.PRICE_MONTH + p.PRICE_QUARTER + p.PRICE_SIX_MONTH + p.PRICE_YEAR) AS TOTAL_LICENSE_COST
		FROM
			LICENSES l
			INNER JOIN SOFTWARE s ON l.SOFTWARE_ID = s.SOFTWARE_ID
			INNER JOIN SOFTWARE_TYPE st ON s.SOFTWARE_TYPE_ID = st.SOFTWARE_TYPE_ID
			INNER JOIN PRICE p ON st.PRICE_ID = p.PRICE_ID
		GROUP BY
			l.SOFTWARE_ID
	) t;

--5
	DECLARE @page_number INT = 1;

	WITH ranked_users AS (
		SELECT *,
			ROW_NUMBER() OVER (ORDER BY user_id) AS row_num
		FROM
			USERS
	)
	SELECT * FROM ranked_users
		WHERE
			row_num BETWEEN ((@page_number - 1) * 20) + 1 AND (@page_number * 20);

--6
	WITH ranked_users AS (
		SELECT *,
			ROW_NUMBER() OVER (PARTITION BY USER_NAME, USER_SURNAME ORDER BY USER_ID) AS row_num
		FROM
			USERS
	)
	DELETE FROM ranked_users
		WHERE row_num > 1;

	INSERT INTO USERS 
		VALUES('IVAN12','IVANOV12','IVAN.IVANOV2003@mail.ru');

	SELECT *FROM USERS order by USER_NAME,USER_SURNAME desc;

	delete users where user_id = 5 ;
--7
	SELECT
			S.SOFTWARE_COMPANY_DEVELOPER AS Vendor,
			DATEADD(MONTH, DATEDIFF(MONTH, 0, L.DATE_OF_PURCHASE), 0) AS Month,
			SUM(P.PRICE_SIX_MONTH) AS TotalExpense
	FROM
		LICENSES L
		INNER JOIN SOFTWARE S ON L.SOFTWARE_ID = S.SOFTWARE_ID
		INNER JOIN SOFTWARE_TYPE ST ON S.SOFTWARE_TYPE_ID = ST.SOFTWARE_TYPE_ID
		INNER JOIN PRICE P ON ST.PRICE_ID = P.PRICE_ID
	WHERE
		L.DATE_OF_PURCHASE >= DATEADD(MONTH, DATEDIFF(MONTH, 0, CURRENT_TIMESTAMP) - 6, 0)

	GROUP BY
		S.SOFTWARE_COMPANY_DEVELOPER,
		DATEADD(MONTH, DATEDIFF(MONTH, 0, L.DATE_OF_PURCHASE), 0)
	ORDER BY
		S.SOFTWARE_COMPANY_DEVELOPER,
		Month;
	
	INSERT INTO LICENSES VALUES(9,32,'2023-10-12','2023-11-12');
	INSERT INTO LICENSES VALUES(2,32,'2023-10-12','2023-11-12');
	SELECT *FROM LICENSES;
	update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2021-06-11',120),
				EXPIRATION_DATE = CONVERT(datetime,'2021-07-11',120)
		where LICENSE_ID = 1;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2021-07-12',120),
				EXPIRATION_DATE = CONVERT(datetime,'2021-08-12',120)
		where LICENSE_ID = 2;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2021-06-11',120),
				EXPIRATION_DATE = CONVERT(datetime,'2021-07-11',120)
		where LICENSE_ID = 3;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2021-07-12',120),
				EXPIRATION_DATE = CONVERT(datetime,'2021-08-12',120)
		where LICENSE_ID = 4;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-01-01',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-06-30',120)
		where LICENSE_ID = 5;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-02-15',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-08-14',120)
		where LICENSE_ID = 6;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-03-20',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-09-19',120)
		where LICENSE_ID = 7;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-04-10',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-10-09',120)
		where LICENSE_ID = 8;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-11-30',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-12-30',120)
		where LICENSE_ID = 9;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-10-12',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-11-12',120)
		where LICENSE_ID = 14;
		update LICENSES 
		set DATE_OF_PURCHASE = CONVERT(datetime,'2023-10-12',120),
				EXPIRATION_DATE = CONVERT(datetime,'2023-11-12',120)
		where LICENSE_ID = 15;
	

	DELETE FROM LICENSES WHERE LICENSE_ID = 13;

--8

	SELECT L.LICENSE_TYPE AS DEVICE_TYPE, ST.SOFTWARE_TYPE, S.SOFTWARE_NAME, COUNT(*) AS UsageCount
		FROM LICENSES L
		INNER JOIN SOFTWARE S ON L.SOFTWARE_ID = S.SOFTWARE_ID
		INNER JOIN SOFTWARE_TYPE ST ON S.SOFTWARE_TYPE_ID = ST.SOFTWARE_TYPE_ID
			GROUP BY L.LICENSE_TYPE, ST.SOFTWARE_TYPE, S.SOFTWARE_NAME
				ORDER BY UsageCount DESC;



SELECT * FROM SOFTWARE_TYPE;
SELECT * FROM LICENSES;

UPDATE LICENSES SET LICENSE_TYPE = 'LAPTOP' WHERE LICENSE_ID = 8;




select * from LICENSES;
INSERT INTO LICENSES VALUES(8,25,'2023-11-30','2023-12-30');
DELETE FROM LICENSES WHERE LICENSE_ID = 9;






SELECT *FROM USERS;

SELECT*FROM LICENSES
	INNER JOIN SOFTWARE 
		ON LICENSES.SOFTWARE_ID=SOFTWARE.SOFTWARE_ID
			INNER JOIN SOFTWARE_TYPE
				ON SOFTWARE_TYPE.SOFTWARE_TYPE_ID = SOFTWARE.SOFTWARE_TYPE_ID
					INNER JOIN PRICE 
						ON SOFTWARE_TYPE.PRICE_ID=PRICE.PRICE_ID;

SELECT * FROM SOFTWARE 
	INNER JOIN SOFTWARE_TYPE
		ON SOFTWARE.SOFTWARE_TYPE_ID = SOFTWARE_TYPE.SOFTWARE_TYPE_ID;

SELECT *FROM SOFTWARE_TYPE;