create table ds_emp (
    emp_id varchar2(10) primary key,
    emp_name varchar2(50) not null,
    dept_code varchar2(256) not null,
    position varchar2(10) not null,
    hire_date date default sysdate,
    salary number(10) not null,
    gender varchar2(256) not null,
    married varchar2(256) not null,
    skill varchar2(256),
    hobby varchar2(256),
    memo varchar2(256)
);


TRUNCATE TABLE ds_emp;

DECLARE
    v_skill_count NUMBER;
    v_hobby_count NUMBER;

    v_skill_selected NUMBER;
    v_hobby_selected NUMBER;

    v_skill VARCHAR2(256);
    v_hobby VARCHAR2(256);

    v_code NUMBER;

    v_hire_date DATE;
    v_career_ratio NUMBER;
    v_salary NUMBER;
BEGIN

    FOR i IN 1..10000 LOOP

        --------------------------------------------------
        -- 스킬 개수: 1 ~ 3
        --------------------------------------------------
        v_skill_count := TRUNC(DBMS_RANDOM.VALUE(1, 4));

        v_skill_selected := 0;
        v_skill := NULL;

        WHILE v_skill_selected < v_skill_count LOOP

            -- 01 ~ 06
            v_code := TRUNC(DBMS_RANDOM.VALUE(1, 7));

            -- 중복 확인
            IF INSTR(
                ',' || NVL(v_skill, '') || ',',
                ',' || LPAD(v_code, 2, '0') || ','
            ) = 0 THEN

                IF v_skill IS NULL THEN
                    v_skill := LPAD(v_code, 2, '0');
                ELSE
                    v_skill := v_skill || ',' || LPAD(v_code, 2, '0');
                END IF;

                v_skill_selected := v_skill_selected + 1;

            END IF;

        END LOOP;


        --------------------------------------------------
        -- 취미 개수: 2 ~ 4
        --------------------------------------------------
        v_hobby_count := TRUNC(DBMS_RANDOM.VALUE(2, 5));

        v_hobby_selected := 0;
        v_hobby := NULL;

        WHILE v_hobby_selected < v_hobby_count LOOP

            -- 01 ~ 15
            v_code := TRUNC(DBMS_RANDOM.VALUE(1, 16));

            -- 중복 확인
            IF INSTR(
                ',' || NVL(v_hobby, '') || ',',
                ',' || LPAD(v_code, 2, '0') || ','
            ) = 0 THEN

                IF v_hobby IS NULL THEN
                    v_hobby := LPAD(v_code, 2, '0');
                ELSE
                    v_hobby := v_hobby || ',' || LPAD(v_code, 2, '0');
                END IF;

                v_hobby_selected := v_hobby_selected + 1;

            END IF;

        END LOOP;


        --------------------------------------------------
        -- 입사일
        -- 최근 10년 이내 랜덤
        --------------------------------------------------
        v_hire_date :=
            TRUNC(SYSDATE - DBMS_RANDOM.VALUE(0, 3650));


        --------------------------------------------------
        -- 경력 비율
        -- 0 = 최근 입사
        -- 1 = 10년 전 입사
        --------------------------------------------------
        v_career_ratio :=
            (SYSDATE - v_hire_date) / 3650;


        --------------------------------------------------
        -- 연봉
        -- 4,000 ~ 7,000만원
        -- 오래된 입사자일수록 평균적으로 높음
        --------------------------------------------------
        v_salary :=
            4000
            + (3000 * v_career_ratio)
            + DBMS_RANDOM.VALUE(-200, 200);

        v_salary :=
            GREATEST(4000, LEAST(7000, v_salary));

        -- 10만원 단위
        v_salary := ROUND(v_salary, -1);


        --------------------------------------------------
        -- 직원 INSERT
        --------------------------------------------------
        INSERT INTO ds_emp (
            emp_id,
            emp_name,
            dept_code,
            position,
            hire_date,
            salary,
            gender,
            married,
            skill,
            hobby,
            memo
        )
        VALUES (
            'EMP' || LPAD(i, 5, '0'),

            '직원' || LPAD(i, 5, '0'),

            -- 부서: 10 ~ 50
            TO_CHAR(TRUNC(DBMS_RANDOM.VALUE(1, 6)) * 10),

            -- 직급: 10 ~ 60
            TO_CHAR(TRUNC(DBMS_RANDOM.VALUE(1, 7)) * 10),

            v_hire_date,

            v_salary,

            -- 성별
            CASE
                WHEN DBMS_RANDOM.VALUE < 0.5 THEN 'M'
                ELSE 'F'
            END,

            -- 결혼 여부
            CASE
                WHEN DBMS_RANDOM.VALUE < 0.5 THEN 'Y'
                ELSE 'N'
            END,

            v_skill,
            v_hobby,

            '더미 데이터'
        );

    END LOOP;

    COMMIT;

END;
/

select * from ds_emp;
