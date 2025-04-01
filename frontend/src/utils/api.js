// api.js
import axios from "axios";

export const API_URL = "http://localhost:3000/api";

export const signup = (userData) =>
  axios.post(`${API_URL}/auth/signup`, userData);

export const login = (userData) =>
  axios.post(`${API_URL}/auth/login`, userData);

export const createTask = (taskData, token) =>
  axios.post(`${API_URL}/tasks`, taskData, {
    headers: { Authorization: `${token}` },
  });

export const getMyTasks = (token) =>
  axios.get(`${API_URL}/tasks/mytasks`, {
    headers: { Authorization: `${token}` },
  });

export const getAllUserss = (token) =>
  axios.get(`${API_URL}/tasks/assigned`, {
    headers: { Authorization: `${token}` },
  });

export const getVisibleTasks = (token) =>
  axios.get(`${API_URL}/tasks/visible`, {
    headers: { Authorization: `${token}` },
  });
