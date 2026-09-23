import { useState } from 'react'
import './Detail.css'
import type { Employee } from '../../types/employee';
import { HOBBY_MAP, POSITION_OPTIONS, SKILL_OPTIONS } from '../../constants/codeMap';

interface EmployeeRowProps {
  employee: Employee;

  handleChange: (
    empId: number,
    field: "empName" | "deptCode" | "position" | "hireDate" | "salary" | "gender" | "married" | "skill" | "hobby" | "memo",
    value: string
  ) => void;
}

function Detail({
  employee,
  handleChange
}: EmployeeRowProps) {
  const [isHobbyOpen, setIsHobbyOpen] = useState(false);

  const skills = employee.skill
    ? employee.skill.split(",")
    : [];

  const hobbies = employee.hobby
    ? employee.hobby.split(",")
    : [];

  // useEffect(() => {
  //   if (open === null) return;

  //   const handleClickOutside = (e: MouseEvent) => {
  //     const target = e.target as Node;

  //     const insideHobby = hobbyRef.current?.contains(target);

  //     document.addEventListener("mousedown", handleClickOutside);

  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   });

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
      employee.empId,
      field,
      newValues.join(",")
    );

  };

  return (
    <>
      <div className="detail-container">
        <table>
          <tbody>
            <tr>
              <td className="detail-td-basic detail-td-title">
                Name
              </td>
              <td className="detail-td-basic detail-td-content">
                <input
                  id="name"
                  className="detail-input-basic"
                  name="name"
                  value={employee.empName || ''}
                  onChange={(e) => handleChange(employee.empId, "empName", e.target.value)}
                />
              </td>
              <td className="detail-td-basic detail-td-title">
                Emp ID
              </td>
              <td className="detail-td-basic detail-td-content">
                <input
                  id="empId"
                  className="detail-input-basic detail-input-empId"
                  name="empId"
                  value={employee.empId || ''}
                  disabled
                />
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title">
                Department
              </td>
              <td className="detail-td-basic detail-td-selectbox detail-td-content">
                <select
                  id="department"
                  name="department"
                  className='detail-select-basic detail-select-department'
                  value={employee.deptCode || ''}
                  onChange={(e) => handleChange(employee.empId, "deptCode", e.target.value)}
                >
                  <option value="10">Accounting Team</option>
                  <option value="20">Finances Team</option>
                  <option value="30">Human Resource Team</option>
                  <option value="40">Support Team</option>
                  <option value="50">Sales Team</option>
                </select>
              </td>
              <td className="detail-td-basic detail-td-title">
                Hire Date
              </td>
              <td className="detail-td-basic detail-td-content">
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={employee.hireDate || ''}
                  className="detail-input-basic"
                  onChange={(e) => handleChange(employee.empId, "hireDate", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title detail-td-salary">
                Salary
              </td>
              <td className="detail-td-basic detail-td-content">
                <input
                  id="salary"
                  className="detail-input-basic detail-input-salary"
                  name="salary"
                  value={employee.salary ? employee.salary.toLocaleString() : ''}
                  onChange={(e) => handleChange(employee.empId, "salary", e.target.value)}
                />
              </td>
              <td className="detail-td-basic detail-td-title">
                Gender/Marial Status
              </td>
              <td className="detail-td-basic detail-td-content detail-td-gender-marital">
                <div className='detail-gender-marital-div'>
                  <div className='detail-gender-group'>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        checked={employee.gender === 'M'}
                        value="M"
                        onChange={(e) => handleChange(employee.empId, "gender", e.target.value)}
                      />
                      {' '}Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        checked={employee.gender === 'F'}
                        value="F"
                        onChange={(e) => handleChange(employee.empId, "gender", e.target.value)}
                      />
                      {' '}Female
                    </label>
                  </div>
                  <label className='detail-label-marital'>
                    <input
                      type="checkbox"
                      id="maritalStatus"
                      name="maritalStatus"
                      checked={employee.married === 'Y'}
                      onChange={(e) => handleChange(employee.empId, "married", e.target.checked ? 'Y' : 'N')}
                    />
                    {' '}Marital Status
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title detail-td-position">
                Position
              </td>
              <td className="detail-td-basic detail-td-content detail-td-position">
                <select
                  size={4}
                  id="position"
                  name="position"
                  className='detail-select-basic detail-select-position'
                  value={employee.position || ''}
                  onChange={(e) => handleChange(employee.empId, "position", e.target.value)}
                >
                  {/* <option value="10">CEO</option>
                  <option value="20">Director</option>
                  <option value="30">General Manager</option>
                  <option value="40">Manager</option>
                  <option value="50">Assistant Manager</option>
                  <option value="60">Staff</option> */}
                  {POSITION_OPTIONS.map((position) => (
                    <option key={position.code} value={position.code}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="detail-td-basic detail-td-title detail-td-memo">
                Memo
              </td>
              <td className="detail-td-basic detail-td-content detail-td-memo">
                <textarea
                  id="memo"
                  name="memo"
                  className='detail-textarea-basic'
                  value={employee.memo || ''}
                  onChange={(e) => handleChange(employee.empId, "memo", e.target.value)}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title detail-td-hobby">
                Hobby
              </td>
              <td className="detail-td-basic detail-td-content detail-td-hobby">
                <div className='detail-dropdown-hobby-div'>
                  <button
                    type="button"
                    className="detail-dropdown-hobby-button"
                    onClick={() => setIsHobbyOpen((prev) => !prev)}
                  >
                    <span>
                      {hobbies.length > 0
                        ? hobbies
                          .map((code) => HOBBY_MAP[code])
                          .join(", ")
                        : 'Select Hobby'}
                    </span>
                    <span>▼</span>
                  </button>

                  {isHobbyOpen && (
                    <div className='hobby-dropdown-menu'>
                      {Object.entries(HOBBY_MAP).map(([code, name]) => (
                        <label key={code} className='detail-hobby-option'>
                          <input
                            type="checkbox"
                            checked={hobbies.includes(code)}
                            onChange={(e) =>
                              handleMultiSelectChange("hobby", code, e.target.checked)
                            }
                          />
                          <span>{name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="detail-td-basic detail-td-title detail-td-skill">
                Skill
              </td>
              <td className="detail-td-basic detail-td-content detail-td-skill">
                <div className='detail-skill-container'>
                  {SKILL_OPTIONS.map((skill) => (
                    <label
                      key={skill.code}
                      className='detail-skill-option'
                      title={skill.name}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        if (el.scrollWidth > el.clientWidth) {
                          el.title = skill.name;
                        } else {
                          el.title = "";
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={skills.includes(skill.code)}
                        onChange={(e) =>
                          handleMultiSelectChange("skill", skill.code, e.target.checked)
                        }
                      />
                      <span>{skill.name}</span>
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Detail