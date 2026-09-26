import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import './MainPage.css'
import { deleteEmployee, getEmployees, getSalaryAvg, saveEmployees } from "../../api/empApi";
import type { Employee } from '../../types/employee';
import { Search } from 'lucide-react';
import EmployeeRow from './EmployeeRow';
import Detail from './Detail';
import { DEPARTMENT_MAP } from '../../constants/codeMap';
import DepartmentModal from './DepartmentModal';

type SortDirection = 'asc' | 'desc' | 'none';

interface SortState {
  key: keyof Employee | null;
  direction: SortDirection;
}

function MainPage() {
  const [emp, setEmp] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [salaryAvg, setSalaryAvg] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [addEmployees, setAddEmployees] = useState<Employee[]>([]);

  const [searchParams, setSearchParams] = useState({
    department: '',
    name: '',
    gender: 'all'
  });

  const appliedSearchParamsRef = useRef({
    department: '',
    name: '',
    gender: 'all'
  });

  const [sortState, setSortState] = useState<SortState>({
    key: null,
    direction: 'none'
  });

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const originalEmployeeRef = useRef<Employee | null>(null);
  const originalEmpMapRef = useRef<Map<string, Employee>>(new Map());

  const pageRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLTableRowElement | null>(null);

  const getCleanSearchParams = () => {
    const current = appliedSearchParamsRef.current;
    const params: Record<string, number | string> = {
      page: pageRef.current,
      size: 50,
    };

    if (current.department) {
      params.deptCode = current.department;
    }

    if (current.name.trim()) {
      params.name = current.name.trim();
    }

    if (current.gender && current.gender !== 'all') {
      params.gender = current.gender;
    }

    return params;
  };

  const loadEmployees = async (isReset = false) => {
    if (loadingRef.current || (!isReset && !hasMoreRef.current)) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const params = getCleanSearchParams();
      const response = await getEmployees(params);
      console.log(response);
      const newEmployees = response.data.content.map((item: Employee) => ({
        ...item,
        _rowId: crypto.randomUUID()
      }));

      if (isReset) {
        originalEmpMapRef.current.clear();
      }

      newEmployees.forEach((item: Employee) => {
        originalEmpMapRef.current.set(item._rowId, JSON.parse(JSON.stringify(item)));
      });

      setEmp((prev) => isReset ? newEmployees : [
        ...prev,
        ...newEmployees
      ]);

      const firstRow = newEmployees[0] ?? null;
      setSelectedEmployee((prev) => isReset ? firstRow : (prev ?? firstRow));
      setSelectedRowId((prev) => isReset ? (firstRow?._rowId ?? null) :
        (prev ?? firstRow?._rowId ?? null));

      hasMoreRef.current = !response.data.last;

      if (isReset) {
        setTotalCount(response.data.totalCount ?? null);
      }

      pageRef.current += 1;

    } catch (error) {
      console.error("직원 조회 실패:", error);

    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {

    const initLoad = async () => {
      await loadEmployees();
    };

    initLoad();
  }, []);

  useEffect(() => {
    const fetchSalaryAvg = async () => {
      try {
        const response = await getSalaryAvg();
        console.log(response);
        setSalaryAvg(response.data);
      } catch (error) {
        console.log("봉급 평균 조회 실패:", error);
      }
    };
    fetchSalaryAvg();
  }, []);

  // useEffect(() => {
  //   if (selectedEmployee) {
  //     originalEmployeeRef.current = JSON.parse(JSON.stringify(selectedEmployee));
  //   }
  // }, [selectedEmployee]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadEmployees();
        }
      },
      {
        root: tableContainerRef.current,
        rootMargin: '100px',
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
    rowId: string,
    field: "empName" | "deptCode" | "position" | "hireDate" | "salary" | "gender" | "married" | "skill" | "hobby" | "memo",
    value: string
  ) => {
    setAddEmployees((prev) =>
      prev.map((item) => (item._rowId === rowId ? { ...item, [field]: value } : item))
    );

    setEmp((prev) =>
      prev.map((employee) => (employee._rowId === rowId ? { ...employee, [field]: value } : employee))
    );

    setSelectedEmployee((currSelected) =>
      currSelected?._rowId === rowId ? { ...currSelected, [field]: value } : currSelected
    );
  }, []
  );

  const handleSelect = useCallback((employee: Employee) => {
    setSelectedRowId(employee._rowId || String(employee.empId));
    setSelectedEmployee(employee);
  }, []);

  const handleSave = async () => {
    const newEmployeesToSave = [...addEmployees];

    const modifiedEmployees = emp.filter((item) => {
      const original = originalEmpMapRef.current.get(item._rowId);
      return original && JSON.stringify(item) !== JSON.stringify(original);
    });

    if (newEmployeesToSave.length === 0 && modifiedEmployees.length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      await saveEmployees({
        createdList: newEmployeesToSave,
        updatedList: modifiedEmployees
      });

      newEmployeesToSave.forEach((item) => {
        originalEmpMapRef.current.set(item._rowId, JSON.parse(JSON.stringify(item)));
      });

      modifiedEmployees.forEach((item) => {
        originalEmpMapRef.current.set(item._rowId, JSON.parse(JSON.stringify(item)));
      });

      if (newEmployeesToSave.length > 0) {
        setEmp((prev) => [...newEmployeesToSave, ...prev]);
        setAddEmployees([]);
      }

      alert(`저장 성공 (신규: ${newEmployeesToSave.length}건, 수정: ${modifiedEmployees.length}건)`);

    } catch (error) {
      console.error("Save 실패:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedEmployee) return;

      const targetRowId = selectedEmployee._rowId;

      const deletedAddIndex = addEmployees.findIndex((item) => item._rowId === targetRowId);

      if (deletedAddIndex !== -1) {
        const nextAddList = addEmployees.filter((item) => item._rowId !== targetRowId);
        setAddEmployees(nextAddList);

        if (nextAddList.length > 0) {
          const nextIndex = Math.min(deletedAddIndex, nextAddList.length - 1);
          const nextSelected = nextAddList[nextIndex];

          setSelectedEmployee(nextSelected);
          setSelectedRowId(nextSelected._rowId || null);
        } else {
          if (emp.length > 0) {
            setSelectedEmployee(emp[0]);
            setSelectedRowId(emp[0]._rowId || null);
          } else {
            setSelectedEmployee(null);
            setSelectedRowId(null);
          }
        }

        originalEmployeeRef.current = null;
        alert("Delete 성공");
        return;
      }

      await deleteEmployee(selectedEmployee.empId);

      const deletedEmpIndex = emp.findIndex((item) => item._rowId === targetRowId);
      const nextEmpList = emp.filter((item) => item._rowId !== targetRowId);
      setEmp(nextEmpList);

      if (nextEmpList.length > 0) {
        const nextIdnex = Math.min(deletedEmpIndex, nextEmpList.length - 1);
        const nextSelected = nextEmpList[nextIdnex];
        setSelectedEmployee(nextSelected);
        setSelectedRowId(nextSelected._rowId || null);
      } else {
        setSelectedEmployee(null);
        setSelectedRowId(null);
      }

      originalEmployeeRef.current = null;
      alert("Delete 성공");

    } catch (error) {
      console.log("Delete 실패:", error);
    }
  };

  const handleAdd = () => {
    if (addEmployees.length >= 3) {
      alert("신규 행은 최대 3줄까지 추가할 수 있습니다.");
      return;
    }

    const uniqueRowId = crypto.randomUUID();
    const uniqueEmpId = uniqueRowId.substring(0, 20);

    const newEmp = {
      _rowId: uniqueRowId,
      empId: uniqueEmpId,
      empName: "",
      deptCode: "10",
      position: "10",
      hireDate: new Date().toISOString().split("T")[0],
      salary: 0,
      gender: "M",
      married: "N",
      skill: "",
      hobby: "",
      memo: ""
    };

    setAddEmployees((prev) => [newEmp, ...prev]);
    setSelectedRowId(uniqueRowId);
    setSelectedEmployee(newEmp);
  };

  const handleSearch = () => {
    appliedSearchParamsRef.current = { ...searchParams };

    pageRef.current = 0;
    hasMoreRef.current = true;
    setEmp([]);
    setAddEmployees([]);

    setSortState({
      key: null,
      direction: 'none'
    });

    loadEmployees(true);
  };

  const handleSearchIcon = () => {
    setIsDeptModalOpen(true);
  };

  const handleSelectDepartment = (deptCode: string) => {
    setSearchParams((prev) => ({
      ...prev,
      department: deptCode,
    }));
  };

  const handleSearchParamsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(searchParams);
  };

  const handleSort = (key: keyof Employee) => {
    let nextDirection: 'asc' | 'desc' | 'none' = 'asc';

    if (sortState.key === key) {
      if (sortState.direction === 'asc') nextDirection = 'desc';
      else if (sortState.direction === 'desc') nextDirection = 'none';
      else nextDirection = 'asc';
    }

    setSortState({ key: nextDirection === 'none' ? null : key, direction: nextDirection });

    setEmp((prevEmp) => {
      if (nextDirection === 'none') {
        return [...prevEmp].sort((a, b) => String(a.empId).localeCompare(String(b.empId), undefined, { numeric: true }));
      }

      const multiplier = nextDirection === 'asc' ? 1 : -1;

      return [...prevEmp].sort((a, b) => {
        const aVal = a[key] ?? '';
        const bVal = b[key] ?? '';

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * multiplier;
        }

        return String(aVal).localeCompare(String(bVal), undefined, { numeric: true }) * multiplier;
      });
    });
  };

  const renderSortIcon = (key: keyof Employee) => {
    if (sortState.key !== key || sortState.direction === 'none') {
      return null;
    }
    return (
      <span style={{ marginLeft: '4px', fontSize: '11px', color: '#2563eb' }}>
        {sortState.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // const sortedEmpList = useMemo(() => {
  //   if(!sortState.key || sortState.direction === 'none') {
  //     return emp;
  //   }

  //   const { key, direction } = sortState;
  //   const multiplier = direction === 'asc' ? 1 : -1;

  //   return [...emp].sort((a, b) => {
  //     const aVal = a[key] ?? '';
  //     const bVal = b[key] ?? '';

  //     if(typeof aVal === 'number' && typeof bVal === 'number') {
  //       return (aVal - bVal) * multiplier;
  //     }

  //     return String(aVal).localeCompare(String(bVal)) * multiplier;
  //   });
  // }, [emp, sortState]);

  // const handleNewChange = (
  //   tempId: number,
  //   field: keyof Employee,
  //   value: string | number
  // ) => {
  //   setNewEmployees((prev) =>
  //     prev.map((item) => item.empId === tempId ? { ...item, [field]: value } : item) 
  //   );
  // };

  // const handleRemoveNewRow = (tempId: number) => {
  //   setNewEmployees((prev) => prev.filter((item) => item.empId !== tempId));
  // };

  return (
    <>
      <div className='dropdown-overlay-container'>
        <div className="page-header">
          <h2>Employees</h2>

          <div className="button-container">
            <button className='btn-retrieve' onClick={handleSearch}>Retrieve</button>
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>

        <div className="search-container">
          <div className="search-item">
            <div className='department-div'><label htmlFor="department">Department</label></div>
            <div className='department-container'>
              <div className='department-input-wrapper'>
                <input
                  id="department-input"
                  name="department"
                  className='department-input'
                  value={searchParams.department || ''}
                  readOnly
                />
                <Search
                  size={18}
                  className="search-icon"
                  onClick={handleSearchIcon}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <input
                id="department-printout"
                className='department-printout'
                value={DEPARTMENT_MAP[searchParams.department] || ''}
                disabled
              />
            </div>

            <DepartmentModal
              isOpen={isDeptModalOpen}
              onClose={() => setIsDeptModalOpen(false)}
              onSelect={handleSelectDepartment}
            />

          </div>

          <div className="search-item">
            <div className='name-div'><label htmlFor="name">Name</label></div>
            <input
              id="search-name"
              name="name"
              className='name-input'
              value={searchParams.name || ''}
              onChange={handleSearchParamsChange}
            />
          </div>

          <div className="search-item gender-item">
            <div className='gender-div'>Gender</div>
            <div className='gender-radio-wrapper'>
              <label>
                <input
                  type="radio"
                  name="gender"
                  className="gender-radio"
                  value="all"
                  checked={searchParams.gender === 'all'}
                  onChange={handleSearchParamsChange}
                />{' '}All
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input
                  type="radio"
                  name="gender"
                  className="gender-radio"
                  value="male"
                  checked={searchParams.gender === 'male'}
                  onChange={handleSearchParamsChange}
                />
                {' '}Male
              </label>
            </div>

            <div className='gender-radio-wrapper'>
              <label>
                <input
                  type="radio"
                  name="gender"
                  className="gender-radio"
                  value="female"
                  checked={searchParams.gender === 'female'}
                  onChange={handleSearchParamsChange}
                />
                {' '}Female
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
              <th onClick={() => handleSort('empName')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Name {renderSortIcon('empName')}
              </th>
              <th onClick={() => handleSort('empId')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Emp ID {renderSortIcon('empId')}
              </th>
              <th onClick={() => handleSort('deptCode')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Department {renderSortIcon('deptCode')}
              </th>
              <th onClick={() => handleSort('position')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Position Grade {renderSortIcon('position')}
              </th>
              <th onClick={() => handleSort('hireDate')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Hire Date {renderSortIcon('hireDate')}
              </th>
              <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Salary {renderSortIcon('salary')}
              </th>
              <th onClick={() => handleSort('gender')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Gender {renderSortIcon('gender')}
              </th>
              <th onClick={() => handleSort('married')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Married {renderSortIcon('married')}
              </th>
              <th onClick={() => handleSort('skill')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Skill {renderSortIcon('skill')}
              </th>
              <th onClick={() => handleSort('hobby')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Hobby {renderSortIcon('hobby')}
              </th>
            </tr>
          </thead>

          <tbody>
            {addEmployees.map((newEmp, index) => (
              <EmployeeRow
                key={newEmp.empId}
                employee={newEmp}
                index={index}
                handleChange={handleChange}
                isSelected={selectedRowId === newEmp._rowId}
                onSelect={handleSelect}
                containerRef={tableContainerRef}
                className='new-add-row'
                style={{ position: 'sticky', top: `${36 + index * 36}px`, zIndex: 990 - index }}
              />
            ))}

            {emp.map((employee, index) => (
              <EmployeeRow
                key={employee.empId}
                employee={employee}
                index={index}
                handleChange={handleChange}
                isSelected={selectedRowId === employee._rowId}
                onSelect={handleSelect}
                containerRef={tableContainerRef}
              />
            ))}

            {loading && (
              <tr className='tr-loading'>
                <td colSpan={11}>데이터를 불러오는 중...</td>
              </tr>
            )}

            {/* 무한 스크롤 감시용 */}
            <tr ref={observerRef} style={{ height: '1px' }}>
              <td colSpan={11} style={{ padding: 0, border: 'none' }}>
              </td>
            </tr>

            <tr className='tr-footer-spacer'>
              <td colSpan={11}></td>
            </tr>

          </tbody>

          <tfoot>
            <tr className='tfoot-salary-avg'>
              <td>{totalCount !== null ? `총 ${totalCount.toLocaleString()}건` : ''}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>Avg.</td>
              <td>{salaryAvg.toLocaleString()}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
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