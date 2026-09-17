export interface Employee {
    empId: number;
    empName: string;
    deptCode: string;
    position: string;
    hireDate: string;
    salary: number;
    gender: string;
    married: boolean;
    skill: string | null;
    hobby: string | null;
    memo: string | null;
}

export interface EmployeeForm {
    position: string[],
    skill: string[],
    hobby: string[],
    married: boolean
}