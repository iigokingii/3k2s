--LAB3
    --#1
        DROP TABLE STORAGE;
        CREATE TABLE STORAGE(
            STORAGE_ID NUMBER PRIMARY KEY,
            ADRESS VARCHAR2(100),
            COUNTRY VARCHAR2(100),
            CAPACITY NUMBER
        );
        
        ALTER TABLE STORAGE 
            ADD STORAGE_NUMBER NUMBER;
        
        ALTER TABLE STORAGE 
            ADD PARENT_STORAGE_NUMBER NUMBER;
            
        ALTER TABLE STORAGE 
            ADD LEVEL_OF_NODE NUMBER;
                
        SELECT * FROM STORAGE;
        
        CREATE OR REPLACE PROCEDURE INSERT_NODE_TO_STORAGE(
            STORAGE_ID IN NUMBER,
            ADRESS IN VARCHAR2,
            COUNTRY IN VARCHAR2,
            CAPACITY IN NUMBER,
            STORAGE_NUMBER IN NUMBER,
            PARENT_STORAGE_NUMBER IN NUMBER,
            LEVEL_OF_NODE IN NUMBER
        )
        AS
        BEGIN
            INSERT INTO STORAGE (STORAGE_ID, ADRESS, COUNTRY, CAPACITY, STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE)
            VALUES (STORAGE_ID, ADRESS, COUNTRY, CAPACITY, STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE);
            
            COMMIT;
            
            DBMS_OUTPUT.PUT_LINE('Node inserted successfully.');
        EXCEPTION
            WHEN OTHERS THEN
                ROLLBACK;
                DBMS_OUTPUT.PUT_LINE('Error inserting node: ' || SQLERRM);
        END;
        /
        BEGIN
            INSERT_NODE_TO_STORAGE(1,'TESTADDR1','BELARUS',2990,213,NULL,1);
            INSERT_NODE_TO_STORAGE(2,'TESTADDR1','BELARUS',3990,219,213,2);
            INSERT_NODE_TO_STORAGE(3,'TESTADDR1','BELARUS',3920,2221,213,2);
            INSERT_NODE_TO_STORAGE(4,'TESTADDR1','BELARUS',3220,228,219,3);
            INSERT_NODE_TO_STORAGE(5,'TESTADDR1','BELARUS',3020,1338,219,3);
        END;
        SELECT *FROM STORAGE;
        DELETE STORAGE WHERE STORAGE_ID = 1 OR STORAGE_ID = 2 OR STORAGE_ID = 3 OR STORAGE_ID = 4 OR STORAGE_ID = 5;
    --#2
        CREATE OR REPLACE PROCEDURE GET_STORAGE_NODES(
            cur OUT SYS_REFCURSOR
        )
        AS
        BEGIN
            OPEN cur FOR
                SELECT STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE
                    FROM STORAGE
                        START WITH PARENT_STORAGE_NUMBER IS NULL
                        CONNECT BY PRIOR STORAGE_NUMBER = PARENT_STORAGE_NUMBER;
        END;
        /
        
        
        DECLARE
            cur SYS_REFCURSOR;
            storage_number NUMBER;
            parent_storage_number NUMBER;
            level_of_node NUMBER;
        BEGIN
            GET_STORAGE_NODES(cur);
            
            LOOP
                FETCH cur INTO storage_number, parent_storage_number, level_of_node;
                EXIT WHEN cur%NOTFOUND;
                
                DBMS_OUTPUT.PUT_LINE('Storage Number: ' || storage_number);
                DBMS_OUTPUT.PUT_LINE('Parent Storage Number: ' || parent_storage_number);
                DBMS_OUTPUT.PUT_LINE('Level of Node: ' || level_of_node);
                DBMS_OUTPUT.PUT_LINE('-------------------------');
            END LOOP;
            
            CLOSE cur;
        END;
        /

    --#3
        CREATE OR REPLACE PROCEDURE ADD_NODE(
            STORAGE_ID IN NUMBER,
            PARENT_NODE_ID IN NUMBER
        )AS
        --DECLARE COUNT_OF_SUCH_NODES NUMBER;
        MAX_NODE_NUMBER NUMBER;
        PARENT_LEVEL NUMBER;
        BEGIN
            SELECT MAX(STORAGE_NUMBER) INTO MAX_NODE_NUMBER FROM STORAGE;
            SELECT LEVEL_OF_NODE INTO PARENT_LEVEL FROM STORAGE WHERE STORAGE_NUMBER = PARENT_NODE_ID;
            MAX_NODE_NUMBER:= MAX_NODE_NUMBER+1;
            PARENT_LEVEL := PARENT_LEVEL+1;
            INSERT INTO STORAGE(STORAGE_ID,STORAGE_NUMBER,PARENT_STORAGE_NUMBER,LEVEL_OF_NODE) 
                VALUES(STORAGE_ID,MAX_NODE_NUMBER,PARENT_NODE_ID,PARENT_LEVEL);
            COMMIT;
        END;
        /
        
        BEGIN
            ADD_NODE(7,228);
        END;
        /
        
        
        SELECT STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE
            FROM STORAGE
                START WITH PARENT_STORAGE_NUMBER IS NULL
                    CONNECT BY PRIOR STORAGE_NUMBER = PARENT_STORAGE_NUMBER;
        
    --#4
        CREATE OR REPLACE PROCEDURE SWAP_PARENTS(
            OLD_NODE IN NUMBER,
            NEW_NODE IN NUMBER
        ) AS
            CURS SYS_REFCURSOR;
            STORAGE_NUMBER_STORAGE STORAGE.STORAGE_NUMBER%TYPE;
            PARENT_STORAGE_NUMBER_STORAGE STORAGE.PARENT_STORAGE_NUMBER%TYPE;
            LEVEL_OF_NODE_STORAGE STORAGE.LEVEL_OF_NODE%TYPE;
        BEGIN
            OPEN CURS FOR
                SELECT STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE
                    FROM STORAGE
                        WHERE PARENT_STORAGE_NUMBER = OLD_NODE;
                
            LOOP
                FETCH CURS INTO STORAGE_NUMBER_STORAGE, PARENT_STORAGE_NUMBER_STORAGE, LEVEL_OF_NODE_STORAGE;
                EXIT WHEN CURS%NOTFOUND;
                
                -- Изменение значения столбца PARENT_STORAGE_NUMBER на NEW_NODE
                UPDATE STORAGE
                    SET PARENT_STORAGE_NUMBER = NEW_NODE
                        WHERE STORAGE_NUMBER = STORAGE_NUMBER_STORAGE;
            END LOOP;
            
            CLOSE CURS;
            
            COMMIT; -- Добавлен коммит, если требуется сохранение изменений в базе данных
        END;
        /
        
        BEGIN
            SWAP_PARENTS(228,1338);
        END;
        /
        
        SELECT STORAGE_NUMBER, PARENT_STORAGE_NUMBER, LEVEL_OF_NODE
            FROM STORAGE
                START WITH PARENT_STORAGE_NUMBER IS NULL
                    CONNECT BY PRIOR STORAGE_NUMBER = PARENT_STORAGE_NUMBER;
        
        SELECT * FROM STORAGE;
            


