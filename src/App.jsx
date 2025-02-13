import React from "react";
import "./App.css";
import TaskColumn from "./components/TaskColumn";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CreateUpdateTask from "./components/CreateUpdateTask";
import { useTask } from "./Context/TaskContext.jsx";

const App = () => {
  const { tasks, showModal, updateTaskId } = useTask();

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      <nav className="h-16 py-3 px-5   w-full bg-gray-700">
        <img src="/logo.svg"></img>
      </nav>

      <div className="container h-full my-0 mx-auto flex p-4 justify-center gap-5">
        <DndProvider backend={HTML5Backend}>
          <TaskColumn
            title={"Pending"}
            taskList={tasks.pending || []}
            type="pending"
            updatingTaskIds={[]}
          ></TaskColumn>
          <TaskColumn
            title={"In Progress"}
            taskList={tasks.in_progress || []}
            type="in_progress"
            updatingTaskIds={[]}
          ></TaskColumn>
          <TaskColumn
            title={"Completed"}
            taskList={tasks.completed || []}
            type="completed"
            updatingTaskIds={[]}
          ></TaskColumn>
        </DndProvider>
      </div>
      {!!showModal && (
        <CreateUpdateTask taskId={updateTaskId}></CreateUpdateTask>
      )}
    </div>
  );
};

export default App;
