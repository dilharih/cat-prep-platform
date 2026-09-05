import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const csrfCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("csrf_token="));

    const csrfToken = csrfCookie
      ? decodeURIComponent(csrfCookie.slice("csrf_token=".length))
      : null;

    if (csrfToken && !["get", "head", "options"].includes(config.method?.toLowerCase())) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
