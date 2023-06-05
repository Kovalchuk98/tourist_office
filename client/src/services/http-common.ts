import axios, { AxiosStatic } from "axios";
import store from "@/store";
import router from "@/router";

const token: string | null = localStorage.getItem("token");

const http = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  },
});

http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      store.dispatch("user/logOut");
      router.push({ path: "/admin/signin" });
    }
    return Promise.reject(error);
  }
);

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `bearer ${token}`;
  }
  return config;
});

export default http;
