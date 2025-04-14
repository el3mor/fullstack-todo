import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000,
})

export default axiosInstance;
 