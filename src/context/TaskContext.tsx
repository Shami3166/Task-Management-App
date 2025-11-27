import React, { createContext, useContext, useReducer, useEffect } from "react";

import apiService from "../services/api";
import { toast } from "sonner";
import type {
  ApiError,
  CreateTaskData,
  FilterOptions,
  Task,
  UpdateTaskData,
} from "@/types/task";

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  filters: FilterOptions;
}

type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_SELECTED_TASK"; payload: Task | null }
  | { type: "SET_FILTERS"; payload: FilterOptions }
  | { type: "CLEAR_FILTERS" };

interface TaskContextType extends TaskState {
  // Task operations
  fetchTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<void>;
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  selectTask: (task: Task | null) => void;

  // Filter operations
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;

  // Utility
  getTaskById: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: applyFilters(action.payload, state.filters),
        isLoading: false,
      };

    case "ADD_TASK": {
      const newTasks = [action.payload, ...state.tasks];
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: applyFilters(newTasks, state.filters),
      };
    }

    case "UPDATE_TASK": {
      const updatedTasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state.filters),
        selectedTask:
          state.selectedTask?._id === action.payload._id
            ? action.payload
            : state.selectedTask,
      };
    }

    case "DELETE_TASK": {
      const filteredTasks = state.tasks.filter(
        (task) => task._id !== action.payload
      );
      return {
        ...state,
        tasks: filteredTasks,
        filteredTasks: applyFilters(filteredTasks, state.filters),
        selectedTask:
          state.selectedTask?._id === action.payload
            ? null
            : state.selectedTask,
      };
    }

    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload };

    case "SET_FILTERS": {
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters,
        filteredTasks: applyFilters(state.tasks, newFilters),
      };
    }

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {},
        filteredTasks: state.tasks,
      };

    default:
      return state;
  }
};

// Helper function to apply filters
const applyFilters = (tasks: Task[], filters: FilterOptions): Task[] => {
  let filtered = tasks;

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((task) => task.status === filters.status);
  }

  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  selectedTask: null,
  isLoading: false,
  filters: {},
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const tasks = await apiService.getTasks();
      dispatch({ type: "SET_TASKS", payload: tasks });
    } catch (error) {
      const err = error as ApiError;
      console.error("Failed to fetch tasks:", err);
      toast.error("Failed to load tasks");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const newTask = await apiService.createTask(taskData);
      dispatch({ type: "ADD_TASK", payload: newTask });
      toast.success("Task created successfully!");
    } catch (error) {
      const err = error as ApiError;
      console.error("Failed to create task:", err);
      toast.error(err.message || "Failed to create task");
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData) => {
    try {
      const updatedTask = await apiService.updateTask(id, taskData);
      dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      toast.success("Task updated successfully!");
    } catch (error) {
      const err = error as ApiError;
      console.error("Failed to update task:", err);
      toast.error(err.message || "Failed to update task");
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiService.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
      toast.success("Task deleted successfully!");
    } catch (error) {
      const err = error as ApiError;
      console.error("Failed to delete task:", err);
      toast.error(err.message || "Failed to delete task");
      throw error;
    }
  };

  const selectTask = (task: Task | null) => {
    dispatch({ type: "SET_SELECTED_TASK", payload: task });
  };

  const setFilters = (filters: FilterOptions) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const getTaskById = (id: string): Task | undefined => {
    return state.tasks.find((task) => task._id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        selectTask,
        setFilters,
        clearFilters,
        getTaskById,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
