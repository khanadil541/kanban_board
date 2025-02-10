import { label } from "framer-motion/client";

export const taskSchema = {
  title: "",
  description: "",
  dueDate: new Date(),
  priority: "High",
  status: "Not Started",
  tags: [],
};

export const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const STATUSES = [
  {
    label: "Pending",
    value: "Not Started",
  },
  {
    label: "In Progress",
    value: "In Progress",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

export const getTaskById = (taskId, taskList) => {
  for (const category in taskList) {
    const task = taskList[category].find((task) => task._id === taskId);
    if (task) return task;
  }
  return taskSchema; // Return initial task if no task is found
};
