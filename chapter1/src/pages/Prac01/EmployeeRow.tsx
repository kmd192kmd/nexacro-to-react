import React, { memo, useEffect, useRef, useState } from 'react';
import type { Employee } from '../../types/employee';
import './EmployeeRow.css'
import {
  DEPARTMENT_MAP,
  GENDER_MAP,
  HOBBY_MAP,
  POSITION_MAP,
  SKILL_MAP,
  SKILL_OPTIONS,
} from '../../constants/codeMap';
import { createPortal } from 'react-dom';

interface EmployeeRowProps {
  employee: Employee;
  index: number;
  isSelected?: boolean;
  onSelect: () => void;

  onChange: (
    empId: number,
    field: "skill" | "hobby" | "position",
    value: string
  ) => void;
}

function EmployeeRow({
  employee,
  index,
  isSelected,
  onSelect,
  onChange,
}: EmployeeRowProps) {

  // const [isSkillOpen, setIsSkillOpen] = useState(false);
  // const [isHobbyOpen, setIsHobbyOpen] = useState(false);
  const [open, setOpen] = useState<"skill" | "hobby" | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const skillButtonRef = useRef<HTMLButtonElement>(null);
  const hobbyButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skills = employee.skill ? employee.skill.split(",") : [];

  const hobbies = employee.hobby ? employee.hobby.split(",") : [];

  const handleToggle = (field: "skill" | "hobby", buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (open === field) {
      setOpen(null);
      setCoords(null);
    } else {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
      setOpen(field);
    }
  };

  useEffect(() => {
    if (open === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const activeBtn = open === "skill" ? skillButtonRef.current : hobbyButtonRef.current;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        activeBtn &&
        !activeBtn.contains(target)
      ) {
        setOpen(null);
        setCoords(null);
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
    <tr onClick={onSelect} style={{ backgroundColor: isSelected ? '#e6f0fa' : 'transparent', cursor: 'pointer' }}>

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
          className="multi-select"
        >
          <button
            ref={skillButtonRef}
            type="button"
            className="select-button"
            onClick={() =>
              handleToggle("skill", skillButtonRef)}
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

        </div>
      </td>

      {/* Hobby */}
      <td>
        <div
          className="multi-select"
        >
          <button
            ref={hobbyButtonRef}
            type="button"
            className='select-button'
            onClick={() =>
              handleToggle("hobby", hobbyButtonRef)}
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

        </div>
      </td>

      {open && coords && createPortal(
        <div
          ref={dropdownRef}
          className="options-fixed"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
          }}
        >
          {open === "skill" ? (
            SKILL_OPTIONS.map((skill) => (
              <label key={skill.code} className="option">
                <input
                  type="checkbox"
                  checked={skills.includes(skill.code)}
                  onChange={(e) =>
                    handleMultiSelectChange("skill", skill.code, e.target.checked)
                  }
                />
                <span>{skill.name}</span>
              </label>
            ))
          ) : (
            Object.entries(HOBBY_MAP).map(([code, name]) => (
              <label key={code} className='option'>
                <input
                  type="checkbox"
                  checked={hobbies.includes(code)}
                  onChange={(e) =>
                    handleMultiSelectChange("hobby", code, e.target.checked)
                  }
                />
                <span>{name}</span>
              </label>
            ))
          )}
        </div>,
        document.body
      )}
    </tr>
  );
}

export default memo(EmployeeRow);