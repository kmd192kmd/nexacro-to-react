import { useRef, useState } from 'react'
import './Detail.css'
import type { Employee } from '../../types/employee';
import { SKILL_OPTIONS } from '../../constants/codeMap';

interface EmployeeRowProps {
  employee: Employee;

  onChange: (
    empId: number,
    field: "skill" | "hobby" | "position",
    value: string
  ) => void;
}

function Detail({
  employee,
  onChange
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

    onChange(
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
                  readOnly
                />
              </td>
              <td className="detail-td-basic detail-td-title">
                Emp ID
              </td>
              <td className="detail-td-basic detail-td-content">
                <input
                  id="empId"
                  className="detail-input-basic"
                  name="empId"
                  value={employee.empId || ''}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title">
                Department
              </td>
              <td className="detail-td-basic detail-td-selectbox detail-td-content">
                <select id="department" name="department">
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
                  readOnly
                  className="detail-input-basic"
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
                  className="detail-input-basic"
                  name="salary"
                  value={employee.salary ? employee.salary.toLocaleString() : ''}
                  readOnly
                />
              </td>
              <td className="detail-td-basic detail-td-title">
                Gender/Marial Status
              </td>
              <td className="detail-td-basic detail-td-content">
                <label>
                  <input type="radio" name="gender" checked={employee.gender === 'M'} readOnly />{' '}Male
                </label>
                <label>
                  <input type="radio" name="gender" checked={employee.gender === 'F'} readOnly />{' '}Female
                </label>
                <label>
                  <input 
                  type="checkbox" 
                  id="maritalStatus" 
                  name="maritalStatus" 
                  checked={employee.married === 'Y'}
                  />{' '}Marital Status
                </label>
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title">
                Position
              </td>
              <td className="detail-td-basic detail-td-content">
                <select
                  size={4}
                  style={{ width: "200px" }}
                  id="position"
                  name="position"
                  value={employee.position || ''}
                  onChange={(e) => onChange(employee.empId, "position", e.target.value)}
                >
                  <option value="10">CEO</option>
                  <option value="20">Director</option>
                  <option value="30">General Manager</option>
                  <option value="40">Manager</option>
                  <option value="50">Assistant Manager</option>
                  <option value="60">Staff</option>
                </select>
              </td>
              <td className="detail-td-basic detail-td-title">
                Memo
              </td>
              <td className="detail-td-basic detail-td-content">
                <textarea
                  id="memo"
                  name="memo"
                  defaultValue={employee.memo || ''}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td className="detail-td-basic detail-td-title">
                Hobby
              </td>
              <td className="detail-td-basic detail-td-content">
                <div className='hobby-dropdown'>
                  <button
                    type="button"
                    className="hobby-dropdown-button"
                    onClick={() => setIsHobbyOpen((prev) => !prev)}
                  >
                    <span>
                      {hobbies.length > 0
                        ? hobbies.join(',')
                        : 'Select Hobby'}
                    </span>
                    <span>▼</span>
                  </button>

                  {isHobbyOpen && (
                    <div className='hobby-dropdown-menu'>
                      {SKILL_OPTIONS.map((hobby) => (
                        <label
                          key={hobby.code}
                          className='option'
                        >
                          <input
                            type="checkbox"
                            checked={hobbies.includes(hobby.code)}
                            onChange={(e) =>
                              handleMultiSelectChange(
                                "hobby",
                                hobby.code,
                                e.target.checked
                              )
                            }
                          />
                          <span>
                            {hobby.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="detail-td-basic detail-td-title">
                Skill
              </td>
              <td className="detail-td-basic detail-td-content">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Detail