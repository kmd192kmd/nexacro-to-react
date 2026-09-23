-- 기존 테이블 삭제
DROP TABLE DS_EMP CASCADE CONSTRAINTS;


-- 테이블 생성
CREATE TABLE DS_EMP (
    EMP_ID       VARCHAR2(20)    PRIMARY KEY,
    EMP_NAME     VARCHAR2(50)    NOT NULL,
    DEPT_CODE    VARCHAR2(20),
    POSITION     VARCHAR2(30),
    HIRE_DATE    DATE,
    SALARY       NUMBER(4),
    GENDER       VARCHAR2(10),
    MARRIED      VARCHAR2(10),
    SKILL        VARCHAR2(500),
    HOBBY        VARCHAR2(1000),
    MEMO         VARCHAR2(1000)
);

INSERT INTO DS_EMP (
    EMP_ID,
    EMP_NAME,
    DEPT_CODE,
    POSITION,
    HIRE_DATE,
    SALARY,
    GENDER,
    MARRIED,
    SKILL,
    HOBBY,
    MEMO
)
SELECT
    'EMP' || LPAD(LEVEL, 5, '0'),

    'Employee' || LEVEL,

    CASE MOD(LEVEL, 5)
        WHEN 0 THEN '10'
        WHEN 1 THEN '20'
        WHEN 2 THEN '30'
        WHEN 3 THEN '40'
        ELSE '50'
    END,

    CASE MOD(LEVEL, 6)
        WHEN 0 THEN '10'
        WHEN 1 THEN '20'
        WHEN 2 THEN '30'
        WHEN 3 THEN '40'
        WHEN 4 THEN '50'
        ELSE '60'
    END,

    DATE '2015-01-01' + MOD(LEVEL * 17, 4000),

    3000 + MOD(LEVEL * 37, 4001),

    CASE MOD(LEVEL, 2)
        WHEN 0 THEN 'M'
        ELSE 'F'
    END,

    CASE MOD(LEVEL, 2)
        WHEN 0 THEN 'Y'
        ELSE 'N'
    END,

    -- SKILL
    CASE MOD(LEVEL, 6)
        WHEN 0 THEN '01,02'
        WHEN 1 THEN '02,03,04'
        WHEN 2 THEN '03,04'
        WHEN 3 THEN '04,05,06'
        WHEN 4 THEN '01,03,06'
        ELSE '04,05'
    END,

    -- HOBBY
    CASE MOD(LEVEL, 10)
        WHEN 0 THEN '01,02'
        WHEN 1 THEN '03,04,05'
        WHEN 2 THEN '06,07'
        WHEN 3 THEN '08,09,10'
        WHEN 4 THEN '11,12'
        WHEN 5 THEN '13,14,15'
        WHEN 6 THEN '01,06,08'
        WHEN 7 THEN '02,04,10,13'
        WHEN 8 THEN '05,07,09,12'
        ELSE '03,08,11,15'
    END,

    'Test employee data ' || LEVEL

FROM DUAL
CONNECT BY LEVEL <= 10000;

COMMIT;

select count(*) from ds_emp;

select * from ds_emp order by emp_Id;