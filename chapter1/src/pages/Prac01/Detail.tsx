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
              <td>
                Name
              </td>
              <td>
                <input
                  id="name"
                  className="detail-basic-input"
                  name="name"
                  value={employee.empName || ''}
                  readOnly
                />
              </td>
              <td>
                Emp ID
              </td>
              <td>
                <input
                  id="empId"
                  className="detail-basic-input"
                  name="empId"
                  value={employee.empId || ''}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                Department
              </td>
              <td>
                <select id="department" name="department">
                  <option value="10">Accounting Team</option>
                  <option value="20">Finances Team</option>
                  <option value="30">Human Resource Team</option>
                  <option value="40">Support Team</option>
                  <option value="50">Sales Team</option>
                </select>
              </td>
              <td>
                Hire Date
              </td>
              <td>
                <input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={employee.hireDate || ''}
                  readOnly
                />
              </td>
            </tr>
            <tr>
              <td>
                Salary
              </td>
              <td>
                <input
                  id="salary"
                  className="detail-basic-input"
                  name="salary"
                  value={employee.salary ? employee.salary.toLocaleString() : ''}
                  readOnly
                />
              </td>
              <td>
                Gender/Marial Status
              </td>
              <td>
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
              <td>
                Position
              </td>
              <td>
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
              <td>
                Memo
              </td>
              <td>
                <textarea
                  id="memo"
                  name="memo"
                  defaultValue={employee.memo || ''}
                ></textarea>
              </td>
            </tr>
            <tr>
              <td>
                Hobby
              </td>
              <td>
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
              <td>
                Skill
              </td>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Detail