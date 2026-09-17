import { useCallback, useEffect, useRef, useState } from 'react';
import './MainPage.css'
import { getEmployees } from "../../api/empApi";
import type { Employee } from '../../types/employee';
import { Search } from 'lucide-react';
import EmployeeRow from './EmployeeRow';

function MainPage() {
  const [emp, setEmp] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEmployees();
      console.log(response);
      setEmp(response.data);
    };

    fetchData();
  }, []);

  const handleChange = useCallback((
    empId: number,
    field: "skill" | "hobby" | "position",
    value: string
  ) => {
    setEmp((prev) =>
      prev.map((employee) => {
        if (employee.empId !== empId) {
          return employee;
        }

        return {
          ...employee,
          [field]: value,
        };
      })
    );
  }, []
  );

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
              <EmployeeRow
                key={employee.empId}
                employee={employee}
                index={index}
                onChange={handleChange}
              />
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