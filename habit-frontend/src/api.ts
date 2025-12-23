import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- AUTH --------
export const register = (username: string, password: string) =>
  api.post("/auth/register", { username, password });

export const login = (username: string, password: string) =>
  api.post("/auth/login", { username, password });

// -------- HABITS --------
export const getHabits = () =>
  api.get("/habits");

export const createHabit = (name: string, description: string) =>
  api.post("/habits", { name, description });
