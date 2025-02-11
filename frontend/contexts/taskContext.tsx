"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Task } from "@/types/task";

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  search: string;
  setSearch: (search: string) => void;
  selectedTasks: any[];
  setSelectedTasks: (data: any) => void;
  deleteBulkTaskData: (taskIds: string[]) => void;
  newTask: boolean;
  setNewTask: (value: boolean) => void;
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  setTasks: () => {},
  search: "",
  setSearch: () => {},
  selectedTasks: [],
  setSelectedTasks: () => {},
  deleteBulkTaskData: () => {},
  newTask: false,
  setNewTask: () => {},
});

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedTasks, setSelectedTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState(false);

  // Function to add a new task
  const addTask = (task: Task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  // Function to update an existing task
  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Function to delete a task
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
  };

  // Function to delete multiple tasks
  const deleteBulkTaskData = (taskIds: string[]) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => !taskIds.includes(task._id))
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        setTasks,
        search,
        setSearch,
        selectedTasks,
        setSelectedTasks,
        deleteBulkTaskData,
        newTask,
        setNewTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => useContext(TaskContext);
