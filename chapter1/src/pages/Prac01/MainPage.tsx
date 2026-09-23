import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import './MainPage.css'
import { deleteEmployee, getEmployees, updateEmployee } from "../../api/empApi";
import type { Employee } from '../../types/employee';
import { Search } from 'lucide-react';
import EmployeeRow from './EmployeeRow';
import Detail from './Detail';

function MainPage() {
  const [emp, setEmp] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const originalEmployeeRef = useRef<Employee | null>(null);

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadEmployees = async () => {
    if (loadingRef.current) return;

    if (!hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await getEmployees(
        pageRef.current,
        50
      );
      console.log(response);
      const newEmployees = response.data.content;

      setEmp((prev) => [
        ...prev,
        ...newEmployees
      ]);

      hasMoreRef.current = !response.data.last;

      pageRef.current += 1;

    } catch (error) {
      console.error("직원 조회 실패:", error);

    } finally {
      loadingRef.current = false;
      setLoading(false);
    }

  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (emp.length > 0 && selectedEmployee === null) {
      setSelectedEmployee(emp[0]);
    }
  }, [emp, selectedEmployee]);

  useEffect(() => {
    if(selectedEmployee) {
      originalEmployeeRef.current = JSON.parse(JSON.stringify(selectedEmployee));
    }
  }, [selectedEmployee?.empId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadEmployees();
        }
      },
      {
        root: tableContainerRef.current,
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleChange = useCallback((
    empId: number,
    field: "empName" | "deptCode" | "position" | "hireDate" | "salary" | "gender" | "married" | "skill" | "hobby" | "memo",
    value: string
  ) => {
    setEmp((prev) =>
      prev.map((employee) => {
        if (employee.empId !== empId) {
          return employee;
        }
        const updated = { ...employee, [field]: value };

        setSelectedEmployee((currSelected) =>
          currSelected?.empId === empId ? updated : currSelected
        );

        return updated;
      })
    );
  }, []
  );

  const handleSelect = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
  }, []);

  const handleSave = async () => {
    if(!selectedEmployee) return;

    const isUnchanged = JSON.stringify(selectedEmployee) === JSON.stringify(originalEmployeeRef.current);

    if(isUnchanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      await updateEmployee(selectedEmployee);
      originalEmployeeRef.current = JSON.parse(JSON.stringify(selectedEmployee));
      alert("Save 성공");
    } catch (error) {
      console.error("Save 실패:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if(!selectedEmployee) return;

      const targetEmpId = selectedEmployee.empId;

      await deleteEmployee(selectedEmployee.empId);

      setEmp((prev) => prev.filter((item) => item.empId !== targetEmpId));

      setSelectedEmployee(null);
      originalEmployeeRef.current = null;

      alert("Delete 성공");

    } catch (error) {
      console.log("Delete 실패:", error);
    }
  };

  return (
    <>
      <div className='dropdown-overlay-container'>
        <div className="page-header">
          <h2>Employees</h2>

          <div className="button-container">
            <button className='btn-retrieve'>Retrieve</button>
            <button>Add</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleSave}>Save</button>
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
                <input type="radio" name="searchGender" className="gender-radio" value="all" defaultChecked />{' '}All
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input type="radio" name="searchGender" className="gender-radio" value="male" />{' '}Male
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input type="radio" name="searchGender" className="gender-radio" value="female" />{' '}Female
              </label>
            </div>

          </div>
        </div>

        <h3>List</h3>
      </div>

      <div
        className='table-container'
        ref={tableContainerRef}
      >
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
                handleChange={handleChange}
                isSelected={selectedEmployee?.empId === employee.empId}
                onSelect={handleSelect}
                containerRef={tableContainerRef}
              />
            ))}

            {/* 무한 스크롤 감시용 */}
            <tr>
              <td colSpan={11}>
                <div
                  ref={observerRef}
                  className='scroll-observer'
                >
                  {loading && "Loading..."}
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className='dropdown-overlay-container'>
        {createElement('h3', null, 'Detail')}
        {selectedEmployee && (
          <Detail
            employee={selectedEmployee}
            handleChange={handleChange}
          />
        )}
      </div>
    </>
  )
}

export default MainPage