import { useCallback, useEffect, useRef, useState } from 'react';
import './MainPage.css'
import { getEmployees } from "../../api/empApi";
import type { Employee } from '../../types/employee';
import { Search } from 'lucide-react';
import EmployeeRow from './EmployeeRow';
import Detail from './Detail';

function MainPage() {
  const [emp, setEmp] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
    field: "skill" | "hobby" | "position",
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

  return (
    <>
      <div className='dropdown-overlay-container'>
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
                <input type="radio" name="gender" className="gender-radio" value="all" defaultChecked />{' '}All
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input type="radio" name="gender" className="gender-radio" value="male" />{' '}Male
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input type="radio" name="gender" className="gender-radio" value="female" />{' '}Female
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
                onChange={handleChange}
                isSelected={selectedEmployee?.empId === employee.empId}
                onSelect={() => setSelectedEmployee(employee)}
                containerRef={tableContainerRef as React.RefObject<HTMLElement>}
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

      <h3>Detail</h3>
      {selectedEmployee && (
        <Detail
          employee={selectedEmployee}
          onChange={handleChange}
        />
      )}
    </>
  )
}

export default MainPage