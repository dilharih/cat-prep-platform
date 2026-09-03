import api from "../../../lib/api";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);

  return response.data;
}

export async function register(userData) {
  const response = await api.post("/auth/register", userData);

  return response.data;
}

export async function googleLogin(idToken) {
  const response = await api.post("/auth/google", { idToken });

  return response.data;
}
