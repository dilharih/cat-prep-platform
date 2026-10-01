import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

if (
  import.meta.env.PROD &&
  (!apiUrl || !apiUrl.startsWith("https://"))
) {
  throw new Error(
    "VITE_API_URL must be configured with an HTTPS URL in production"
  );
}

const api = axios.create({
  baseURL: apiUrl || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const csrfCookie = document.cookie
      .split("; ")
      .find(
        (cookie) =>
          cookie.startsWith("csrf_token=") || cookie.startsWith("__Host-csrf=")
      );

    const separatorIndex = csrfCookie?.indexOf("=");
    const csrfToken =
      csrfCookie && separatorIndex !== undefined
        ? decodeURIComponent(csrfCookie.slice(separatorIndex + 1))
        : null;

    if (
      csrfToken &&
      !["get", "head", "options"].includes(config.method?.toLowerCase())
    ) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
