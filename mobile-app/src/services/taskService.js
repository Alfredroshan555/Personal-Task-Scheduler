import axios from "axios";
import { API_URL } from "../constants/api";

const api = axios.create({
  baseURL: API_URL,
});

export const taskService = {
  getTasks: async () => {
    const response = await api.get("/tasks");
    return response.data;
  },
  addTask: async (task) => {
    const response = await api.post("/tasks", task);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
