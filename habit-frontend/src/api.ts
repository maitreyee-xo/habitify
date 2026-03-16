import axios from "axios";

/* ---------------- BASE URLS ---------------- */

const AUTH_BASE_URL = "http://localhost:8081/auth";
const HABIT_BASE_URL = "http://localhost:8082";

/* ---------------- AXIOS INSTANCES ---------------- */

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const habitApi = axios.create({
  baseURL: HABIT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- JWT INTERCEPTOR ---------------- */

habitApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- AUTH ---------------- */

export const login = (email: string, password: string) =>
  authApi.post("/login", { email, password });

export const register = (email: string, password: string) =>
  authApi.post("/register", { email, password });

/* ---------------- HABITS ---------------- */

export const getHabits = () =>
  habitApi.get("/habits");

export const createHabit = (name: string, description: string) =>
  habitApi.post("/habits", { name, description });

export const completeHabit = (habitId: number) =>
  habitApi.post(`/habits/${habitId}/complete`);

export const deleteHabitApi = (habitId: number) =>
  habitApi.delete(`/habits/${habitId}`);