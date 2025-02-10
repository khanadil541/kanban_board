import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const TaskContext = createContext();

const STATUS_MAP = {
  pending: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};
const STATUS_MAP_REV = {
  "Not Started": "pending",
  "In Progress": "in_progress",
  Completed: "completed",
};
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState("");
  async function fetchTodos() {
    try {
      let res = await axios.get("https://shrimo.com/fake-api/todos");
      //setTodos(res?.data || []);
      const formattedTodos = {
        pending: res.data.filter((task) => task.status === "Not Started"),
        in_progress: res.data.filter((task) => task.status === "In Progress"),
        completed: res.data.filter((task) => task.status === "Completed"),
      };
      setTasks(formattedTodos);
    } catch (error) {}
  }
  async function updateTask(taskData) {
    try {
      let res = await axios.put(
        `https://shrimo.com/fake-api/todos/${taskData._id}`,
        taskData
      );
      console.log("res update", res);
      if (res.data) {
      }
    } catch (e) {}
  }
  function moveTask(source, destination, data) {
    console.log(source, destination, data);

    setTasks((prevTodos) => {
      // Create copies of the source and destination columns to avoid mutating state directly
      const sourceColumn = [...prevTodos[source]];
      const destColumn = [...prevTodos[destination]];

      // Find the index of the item being moved in the source column
      const movedItemIndex = sourceColumn.findIndex(
        (item) => item._id === data.id
      );

      // If the item is not found, return the previous state unchanged
      if (movedItemIndex === -1) return prevTodos;

      // Update the task status on the server
      updateTask({
        ...sourceColumn[movedItemIndex],
        ...{ status: STATUS_MAP[destination] },
      });
      // Remove the item from the source column and store it
      const [movedItem] = sourceColumn.splice(movedItemIndex, 1);

      // Add the moved item to the destination column
      destColumn.push(movedItem);

      // Return the updated task list with the new column assignments
      return {
        ...prevTodos,
        [source]: sourceColumn,
        [destination]: destColumn,
      };
    });
  }

  function onTaskCreate(data, id) {
    let existingTaskId = id || data.id || "";
    setTasks((prevTodos) => {
      // Combine all tasks into a single array for easy lookup
      const allTasks = [
        ...prevTodos.pending,
        ...prevTodos.in_progress,
        ...prevTodos.completed,
      ];
      // Find if the task already exists
      const existingTask = allTasks.find((task) => task._id === existingTaskId);

      // Assign the existing task ID to the new data
      data["_id"] = existingTaskId;
      if (existingTask) {
        // If task exists, update it in its respective column
        return {
          ...prevTodos,
          [STATUS_MAP_REV[data.status]]: prevTodos[
            STATUS_MAP_REV[data.status]
          ].map((task) => (task._id === existingTaskId ? data : task)),
        };
      } else {
        // If task does not exist, add it to the correct list based on its status
        return {
          ...prevTodos,
          [STATUS_MAP_REV[data.status]]: [
            ...prevTodos[STATUS_MAP_REV[data.status]],
            data,
          ], // Add new task to the correct list
        };
      }
    });
  }
  async function deleteTask(id) {
    try {
      let res = await axios.delete(`https://shrimo.com/fake-api/todos/${id}`);
      console.log("res update", res);
      if (res.data) {
        setTasks((prevTasks) => ({
          pending: prevTasks.pending.filter((task) => task._id !== id),
          in_progress: prevTasks.in_progress.filter((task) => task._id !== id),
          completed: prevTasks.completed.filter((task) => task._id !== id),
        }));
      }
    } catch (e) {}
  }
  function toggleModal(val, taskId) {
    setShowModal(val);
    if (!!taskId && !!val) {
      setUpdateTaskId(taskId);
    } else {
      setUpdateTaskId("");
    }
  }
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        moveTask,
        onTaskCreate,
        showModal,
        setShowModal,
        deleteTask,
        toggleModal,
        updateTaskId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
