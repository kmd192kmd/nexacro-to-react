import React, { useEffect, useState } from 'react';
import './MainPage.css'
import { getEmployees } from "../../api/empApi";
import type { Employee, EmployeeForm } from '../../types/employee';
import { Search } from 'lucide-react';
import { DEPARTMENT_MAP, GENDER_MAP, HOBBY_MAP, POSITION_MAP, SKILL_MAP, SKILL_OPTIONS } from '../../constants/codeMap';

function MainPage() {
  const [emp, setEmp] = useState<Employee[]>([]);
  const [form, setForm] = useState<EmployeeForm>({
    position: [],
    skill: [],
    hobby: [],
    married: false,
  });

  const [skillOpen, setSkillOpen] = useState(false);

  const toArray = (value: string | null) => {
    return value ? value.split(",") : [];
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployees();
      console.log(response);
      setEmp(response.data);
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      skill: checked
        ? [...prev.skill, value]
        : prev.skill.filter((code) => code !== value),
    }))
  };

  return (
    <>
      <div className="page-header">
        <h2>Employees</h2>

        <div className="button-container">
          <button className='btn-retrieve'>Retrieve</button>
          <button>Add</button>
          <button>Delete</button>
          <button>Save</button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-item">
          <div className='department-div'><label htmlFor="department">Department</label></div>
          <div className='department-container'>
            <div className='department-input-wrapper'>
              <input id="department" name="department" className='department-input' />
              <Search size={18} />
            </div>
            <input id="department-printout" className='department-printout' disabled />
          </div>
        </div>

        <div className="search-item">
          <div className='name-div'><label htmlFor="name">Name</label></div>
          <input id="name" name="name" className='name-input' />
        </div>

        <div className="search-item gender-item">
          <div className='gender-div'>Gender</div>
          <div className='gender-radio-wrapper'>
            <label>
              <input type="radio" name="gender" className="gender-radio" value="all" defaultChecked /> All
            </label>
          </div>

          <div className='gender-radio-wrapper'>
            <label>
              <input type="radio" name="gender" className="gender-radio" value="male" /> Male
            </label>
          </div>

          <div className='gender-radio-wrapper'>
            <label>
              <input type="radio" name="gender" className="gender-radio" value="female" /> Female
            </label>
          </div>

        </div>
      </div>

      <h3>List</h3>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Emp ID</th>
              <th>Department</th>
              <th>Position Grade</th>
              <th>Hire Date</th>
              <th>Salary</th>
              <th>Gender</th>
              <th>Married</th>
              <th>Skill</th>
              <th>Hobby</th>
            </tr>
          </thead>

          <tbody>
            {emp.map((employee, index) => (
              <tr key={employee.empId}>
                <td>{index + 1}</td>
                <td>{employee.empName}</td>
                <td>{employee.empId}</td>
                <td>{DEPARTMENT_MAP[employee.deptCode]}</td>
                <td>{POSITION_MAP[employee.position]}</td>
                <td>{employee.hireDate}</td>
                <td>{employee.salary.toLocaleString()}</td>
                <td>{GENDER_MAP[employee.gender]}</td>
                <td>{employee.married}</td>

                <div className="multi-select">
                  <button
                    type="button"
                    className="select-button"
                    onClick={() => setSkillOpen((prev) => !prev)}>
                    <span>
                      {form.skill.length > 0
                        ? form.skill
                          .map((code) => SKILL_MAP[code])
                          .join(", ")
                        : "스킬 선택"}
                    </span>
                    <span>▼</span>
                  </button>

                  {skillOpen && (
                    <div className="options">
                      {SKILL_OPTIONS.map((skill) => (
                        <label key={skill.code} className="option">
                          <input
                            type="checkbox"
                            checked={form.skill.includes(skill.code)}
                            onChange={handleChange}
                          />
                          <span>{skill.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <td>{HOBBY_MAP[employee.hobby ?? ""]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Detail</h3>
      세부사항 생성 예정
    </>
  )
}

export default MainPage