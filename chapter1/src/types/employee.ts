export interface Employee {
    _rowId: string;
    empId: string;
    empName: string;
    deptCode: string;
    position: string;
    hireDate: string;
    salary: number;
    gender: string;
    married: string;
    skill: string | null;
    hobby: string | null;
    memo: string | null;
}

export interface EmployeeForm {
    position: string[],
    skill: string[],
    hobby: string[],
    married: string
}