import React, { memo, useEffect, useRef, useState } from 'react';
import type { Employee } from '../../types/employee';
import './EmployeeRow.css'
import {
  DEPARTMENT_MAP,
  GENDER_MAP,
  HOBBY_MAP,
  POSITION_OPTIONS,
  SKILL_MAP,
  SKILL_OPTIONS,
} from '../../constants/codeMap';
import { createPortal } from 'react-dom';

interface EmployeeRowProps {
  employee: Employee;
  index: number;
  isSelected?: boolean;
  onSelect: (employee: Employee) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;

  handleChange: (
    rowId: string,
    field: "empName" | "deptCode" | "position" | "hireDate" | "salary" | "gender" | "married" | "skill" | "hobby" | "memo",
    value: string
  ) => void;
  className?: string;
  style?: React.CSSProperties;
}

function EmployeeRow({
  employee,
  index,
  isSelected,
  onSelect,
  handleChange,
  containerRef,
  className = '',
  style = {}
}: EmployeeRowProps) {

  // const [isSkillOpen, setIsSkillOpen] = useState(false);
  // const [isHobbyOpen, setIsHobbyOpen] = useState(false);
  const [open, setOpen] = useState<"skill" | "hobby" | null>(null);
  const [coords, setCoords] = useState<{
    top: number; left: number; width: number;
    containerTop: number; containerBottom: number; containerLeft: number; containerWidth: number;
    buttonAbove: boolean; buttonBelow: boolean;
  } | null>(null);

  const skillButtonRef = useRef<HTMLButtonElement>(null);
  const hobbyButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const skills = employee.skill ? employee.skill.split(",") : [];

  const hobbies = employee.hobby ? employee.hobby.split(",") : [];

  const updateCoords = () => {
    const buttonRef = open === "skill" ? skillButtonRef : hobbyButtonRef;

    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const buttonAbove = rect.bottom <= containerRect.top;
    const buttonBelow = rect.top >= containerRect.bottom;

    setCoords({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,

      containerTop: containerRect.top,
      containerBottom: containerRect.bottom,
      containerLeft: containerRect.left,
      containerWidth: containerRect.width,

      buttonAbove,
      buttonBelow,
    });
  };

  const handleToggle = (field: "skill" | "hobby", buttonRef: React.RefObject<HTMLButtonElement | null>) => {

    if (open === field) {
      setOpen(null);
      setCoords(null);

      return;
    }

    setOpen(field);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const buttonAbove = rect.bottom <= containerRect.top;
      const buttonBelow = rect.top >= containerRect.bottom;

      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,

        containerTop: containerRect.top,
        containerBottom: containerRect.bottom,
        containerLeft: containerRect.left,
        containerWidth: containerRect.width,

        buttonAbove,
        buttonBelow,
      });
    }
  };

  useEffect(() => {
    if (open === null) return;

    updateCoords();

    const handleResize = () => {
      updateCoords();
    };

    let animationFrameId: number | null = null;

    const handleScroll = () => {
      if (animationFrameId !== null) return;

      animationFrameId = requestAnimationFrame(() => {
        updateCoords();
        animationFrameId = null;
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

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

    handleChange(
      employee._rowId!,
      field,
      newValues.join(",")
    );
  };

  return (
    <tr onClick={() => onSelect(employee)} style={{ backgroundColor: isSelected ? '#e6f0fa' : 'transparent', cursor: 'pointer' }}>

      <td>
        {index + 1}
      </td>

      <td
        className='ellipsis-cell'
        onMouseEnter={(e) => {
          const spanEl = e.currentTarget;
          if (spanEl.scrollWidth > spanEl.clientWidth) {
            spanEl.title = `${employee.empName}`;
          } else {
            spanEl.title = "";
          }
        }}
      >
        {employee.empName}
      </td>

      <td
        className='ellipsis-cell'
        onMouseEnter={(e) => {
          const spanEl = e.currentTarget;
          if (spanEl.scrollWidth > spanEl.clientWidth) {
            spanEl.title = `${employee.empId}`;
          } else {
            spanEl.title = "";
          }
        }}>
        {employee.empId}
      </td>

      <td
        className='ellipsis-cell'
        onMouseEnter={(e) => {
          const spanEl = e.currentTarget;
          if (spanEl.scrollWidth > spanEl.clientWidth) {
            spanEl.title = `${DEPARTMENT_MAP[employee.deptCode]}`;
          } else {
            spanEl.title = "";
          }
        }}
      >
        {DEPARTMENT_MAP[employee.deptCode]}
      </td>

      <td className='ellipsis-cell'>
        <select
          value={employee.position || ""}
          className='employeeRow-select-basic employeeRow-select-position'
          onChange={(e) =>
            handleChange(employee._rowId!, "position", e.target.value)
          }
        >
          {POSITION_OPTIONS.map((position) => (
            <option key={position.code} value={position.code}>
              {position.name}
            </option>
          ))}
        </select>
      </td>

      <td className='ellipsis-cell'>{employee.hireDate}</td>

      <td className='ellipsis-cell'>
        {employee.salary.toLocaleString()}
      </td>

      <td className='ellipsis-cell'>
        {GENDER_MAP[employee.gender]}
      </td>

      <td className='ellipsis-cell'>
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
            onClick={() => {
              //e.stopPropagation();
              handleToggle("skill", skillButtonRef);
            }}
          >
            <span
              onMouseEnter={(e) => {
                const spanEl = e.currentTarget;
                if (spanEl.scrollWidth > spanEl.clientWidth) {
                  spanEl.title = skills.map((code) => SKILL_MAP[code]).join(", ");
                } else {
                  spanEl.title = "";
                }
              }}
            >
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
            onClick={() => {
              //e.stopPropagation();
              handleToggle("hobby", hobbyButtonRef);
            }}
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
        <>
          {coords.buttonAbove && (
            <div
              className="dropdown-clip-overlay"
              style={{
                top: 0,
                left: `${coords.containerLeft}px`,
                width: `${coords.containerWidth}px`,
                height: `${Math.max(0, coords.containerTop)}px`,
              }}
            />
          )}

          {coords.buttonBelow && (
            <div
              className='dropdown-clip-overlay'
              style={{
                top: `${coords.containerBottom}px`,
                left: `${coords.containerLeft}px`,
                width: `${coords.containerWidth}px`,
                bottom: 0,
              }}
            />
          )}

          <div
            ref={dropdownRef}
            className="options-fixed"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: coords.buttonAbove || coords.buttonBelow ? 1000 : 1003,
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
          </div>
        </>,
        document.body
      )}
    </tr>
  );
}

export default memo(EmployeeRow);