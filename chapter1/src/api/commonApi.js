import axios from "axios";

const commonApi = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

commonApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    return Promise.reject(error);
  }
);

export default commonApi;