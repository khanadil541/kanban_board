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
    //setUpdatingTaskIds(...updatingTaskIds, [...taskData._id]);
    try {
      let res = await axios.put(
        `https://shrimo.com/fake-api/todos/${taskData._id}`,
        taskData
      );
      console.log("res update", res);
      if (res.data) {
        //setUpdatingTaskIds([]);
      }
    } catch (e) {}
  }
  function moveTask(source, destination, data) {
    console.log(source, destination, data);

    setTasks((prevTodos) => {
      const sourceColumn = [...prevTodos[source]];
      const destColumn = [...prevTodos[destination]];
      const movedItemIndex = sourceColumn.findIndex(
        (item) => item._id === data.id
      );
      if (movedItemIndex === -1) return prevTodos;
      updateTask({
        ...sourceColumn[movedItemIndex],
        ...{ status: STATUS_MAP[destination] },
      });
      const [movedItem] = sourceColumn.splice(movedItemIndex, 1);
      destColumn.push(movedItem);

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
      const allTasks = [
        ...prevTodos.pending,
        ...prevTodos.in_progress,
        ...prevTodos.completed,
      ];
      const existingTask = allTasks.find((task) => task._id === existingTaskId);
      data["_id"] = existingTaskId;
      if (existingTask) {
        return {
          ...prevTodos,
          [STATUS_MAP_REV[data.status]]: prevTodos[
            STATUS_MAP_REV[data.status]
          ].map((task) => (task._id === existingTaskId ? data : task)),
        };
      } else {
        return {
          ...prevTodos,
          [STATUS_MAP_REV[data.status]]: [
            ...prevTodos[STATUS_MAP_REV[data.status]],
            data,
          ], // ✅ Add new task to the correct list
        };
      }
    });
  }
  async function deleteTask(id) {
    try {
      let res = await axios.delete(`https://shrimo.com/fake-api/todos/${id}`);
      console.log("res update", res);
      if (res.data) {
        //setUpdatingTaskIds([]);
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
