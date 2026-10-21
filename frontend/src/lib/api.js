import axios from "axios";

// In production, call the API through Vercel's same-origin rewrite.
// This keeps the session and CSRF cookies on the frontend origin instead
// of relying on cross-site cookies between Vercel and Render.
const apiUrl = import.meta.env.PROD
  ? `${window.location.origin}/api`
  : (import.meta.env.VITE_API_URL || "http://localhost:5000/api");

if (import.meta.env.PROD && !apiUrl.startsWith("https://")) {
  throw new Error("The production API URL must use HTTPS");
}

const api = axios.create({
  baseURL: apiUrl,
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
