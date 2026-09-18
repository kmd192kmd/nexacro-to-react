import commonApi from "./commonApi"

export const getEmployees = (page, size) => {
    return commonApi.get("/emp", {
        params: {
            page,
            size
        },
    });
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