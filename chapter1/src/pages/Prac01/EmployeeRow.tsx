import { memo, useEffect, useRef, useState } from 'react';

import type { Employee } from '../../types/employee';

import {
  DEPARTMENT_MAP,
  GENDER_MAP,
  HOBBY_MAP,
  POSITION_MAP,
  SKILL_MAP,
  SKILL_OPTIONS,
} from '../../constants/codeMap';

interface EmployeeRowProps {
  employee: Employee;
  index: number;

  onChange: (
    empId: number,
    field: "skill" | "hobby" | "position",
    value: string
  ) => void;
}

function EmployeeRow({
  employee,
  index,
  onChange,
}: EmployeeRowProps) {

  // const [isSkillOpen, setIsSkillOpen] = useState(false);
  // const [isHobbyOpen, setIsHobbyOpen] = useState(false);
  const [open, setOpen] = useState<"skill" | "hobby" | null>(null);

  const skillRef = useRef<HTMLDivElement>(null);
  const hobbyRef = useRef<HTMLDivElement>(null);

  const skills = employee.skill
    ? employee.skill.split(",")
    : [];

  const hobbies = employee.hobby
    ? employee.hobby.split(",")
    : [];

  // const toArray = (value: string | null) => {
  //   return value ? value.split(",") : [];
  // };

  useEffect(() => {
    if(open === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const insideKill = skillRef.current?.contains(target);

      const insideHobby = hobbyRef.current?.contains(target);

      if(!insideKill && !insideHobby) {
        setOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [open]);

  const handleMultiSelectChange = (
    field: "skill" | "hobby",
    code: string,
    checked: boolean
  ) => {
    const currentValues =
      field === "skill"
        ? skills
        : hobbies;

    const newValues = checked
      ? [...currentValues, code]
      : currentValues.filter(
        (value) => value !== code
      );

    onChange(
      employee.empId,
      field,
      newValues.join(",")
    );
  };

  return (
    <tr>

      <td>{index + 1}</td>

      <td>{employee.empName}</td>

      <td>{employee.empId}</td>

      <td>
        {DEPARTMENT_MAP[employee.deptCode]}
      </td>

      <td>
        {POSITION_MAP[employee.position]}
      </td>

      <td>{employee.hireDate}</td>

      <td>
        {employee.salary.toLocaleString()}
      </td>

      <td>
        {GENDER_MAP[employee.gender]}
      </td>

      <td>
        {employee.married}
      </td>

      {/* Skill */}
      <td>
        <div
          ref={skillRef}
          className="multi-select"
        >
          <button
            type="button"
            className="select-button"
            onClick={() =>
              setOpen(prev => prev === "skill" ? null : "skill")
            }
          >
            <span>
              {skills.length > 0
                ? skills
                  .map((code) => SKILL_MAP[code])
                  .join(", ")
                : "스킬 선택"}
            </span>
            <span>
              ▼
            </span>
          </button>

          {open === "skill" && (
            <div className="options">
              {SKILL_OPTIONS.map((skill) => (
                <label
                  key={skill.code}
                  className="option"
                >
                  <input
                    type="checkbox"
                    checked={skills.includes(skill.code)}
                    onChange={(e) =>
                      handleMultiSelectChange(
                        "skill",
                        skill.code,
                        e.target.checked
                      )
                    }
                  />
                  <span>
                    {skill.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Hobby */}
      <td>
        <div
          ref={hobbyRef}
          className="multi-select"
        >
          <button
            type="button"
            className='select-button'
            onClick={() =>
              setOpen(prev => prev === "hobby" ? null : "hobby")
            }
          >
            <span>
              {hobbies.length > 0
                ? hobbies
                  .map((code) => HOBBY_MAP[code])
                  .join(", ")
                : "취미 선택"}
            </span>
            <span>▼</span>
          </button>

          {open === "hobby" && (
            <div className='options'>
              {Object.entries(HOBBY_MAP).map(
                ([code, name]) => (
                  <label
                    key={code}
                    className='option'>
                    <input
                      type="checkbox"
                      checked={hobbies.includes(code)}
                      onChange={(e) =>
                        handleMultiSelectChange(
                          "hobby",
                          code,
                          e.target.checked
                        )}
                    />
                    <span>
                      {name}
                    </span>
                  </label>
                )
              )}
            </div>
          )}

        </div>
      </td>

    </tr>
  );
}

export default memo(EmployeeRow);