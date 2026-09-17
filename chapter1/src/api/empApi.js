import commonApi from "./commonApi";

export const getEmployees = () => {
    return commonApi.get("/emp");
};

export const getEmployee = (empId) => {
    return commonApi.get(`/emp/${empId}`);
};

export const createEmployee = (emp) => {
    return commonApi.post("/emp", emp);
};

export const updateEmployee = (empId, emp) => {
    return commonApi.put(`/emp/${empId}`, emp);
};

export const deleteEmployee = (empId) => {
    return commonApi.delete(`/emp/${empId}`);
};