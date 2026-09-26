import commonApi from "./commonApi"

export const getEmployees = (params) => {
    return commonApi.get("/emp", {
        params,
    });
};

export const getEmployee = (empId) => {
    return commonApi.get(`/emp/${empId}`);
};

export const createEmployee = (emp) => {
    return commonApi.post("/emp", emp);
};

export const updateEmployee = (emp) => {
    return commonApi.put(`/emp/${emp.empId}`, emp);
};

export const deleteEmployee = (empId) => {
    return commonApi.delete(`/emp/${empId}`);
};

export const getSalaryAvg = () => {
    return commonApi.get('/emp/salary/avg');
};

export const saveEmployees = (employees) => {
    return commonApi.post('/emp/save', employees);
};