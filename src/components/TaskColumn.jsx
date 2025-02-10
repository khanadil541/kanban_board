import React, { Fragment, useState } from "react";
import TaskCard from "./TaskCard";
import { motion } from "framer-motion";
import { useDrop } from "react-dnd";
import CreateUpdateTask from "./CreateUpdateTask";
import { useTask } from "../Context/TaskContext";

export default function TaskColumn({ taskList, title, type, updatingTaskIds }) {
  const { moveTask, onTaskCreate, showModal, setShowModal } = useTask();
  const [collectedProps, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      console.log("Dropped Item:", item, type);
      if (item.source === type) {
        return;
      }
      //onTaskMove(item.source, type, item);
      moveTask(item.source, type, item);
    },
  });
  function createTask() {
    setShowModal(true);
  }
  function toggleModal(val, data) {
    setShowModal(val);
    if (!!data?.data) {
      onTaskCreate(data);
    }
  }
  return (
    <Fragment>
      <div className="w-1/4 px-3" ref={drop}>
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-[500] text-base text-gray-200">{title}</h4>
          <i className="text-base"></i>
        </div>

        {!!taskList &&
          taskList.map((task) => (
            <TaskCard
              data={task}
              key={task._id}
              type={type}
              isUpdating={updatingTaskIds.includes(task._id)}
            ></TaskCard>
          ))}
        <button
          className=" bg-gray-600 flex p-3 rounded-lg justify-center gap-2 items-center text-gray-400 text-base w-full border-1 border-gray-400 border-dashed cursor-pointer"
          onClick={createTask}
        >
          <i className="fa fa-plus"></i>
          Add New Task
        </button>
      </div>
    </Fragment>
  );
}
