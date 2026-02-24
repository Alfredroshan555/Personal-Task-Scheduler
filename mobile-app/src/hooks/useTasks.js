import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/taskService";

export const useTasks = (showSnackbar) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (showSnackbar) {
        showSnackbar("Failed to fetch tasks. Is the server running?");
      }
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      if (showSnackbar) showSnackbar("Task deleted");
      fetchTasks();
    } catch (error) {
      console.error(error);
      if (showSnackbar) showSnackbar("Failed to delete task");
    }
  };

  const addTask = async (taskData) => {
    try {
      await taskService.addTask(taskData);
      if (showSnackbar) showSnackbar("Task added successfully!");
      fetchTasks();
      return true;
    } catch (error) {
      console.error(error);
      if (showSnackbar) showSnackbar("Error adding task. Check console.");
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    fetchTasks,
    deleteTask,
    addTask,
  };
};
