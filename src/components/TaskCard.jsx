import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { useDrag } from "react-dnd";
import { useTask } from "../Context/TaskContext";
import CreateUpdateTask from "./CreateUpdateTask";

export default function TaskCard({ data, type, isUpdating }) {
  const { title, description, priority, tags, _id, status } = data;
  const { deleteTask, toggleModal } = useTask();
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: _id, source: type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Fragment>
      <motion.div
        ref={drag}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="cursor-grab"
      >
        <div
          className={`bg-gray-600 rounded-lg p-2 mb-3 relative ${
            isUpdating ? "opacity-10" : "opacity-100"
          }`}
        >
          <div>
            <h3 className="font-[600] text-gray-100">{title}</h3>
            <div className="absolute right-2 top-2">
              <i
                className="fa fa-trash mr-2 text-sm cursor-pointer"
                onClick={() => deleteTask(_id, type)}
              ></i>
              <i
                className="fa fa-edit text-sm cursor-pointer"
                onClick={() => toggleModal(true, _id)}
              ></i>
            </div>
            <span
              className={`py-[3px] px-2 text-xs rounded ${
                priority === "High" ? "bg-red-500" : "bg-amber-400"
              }`}
            >
              {priority} {isUpdating}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-gray-300">{description}</p>
          </div>
          <div className="mt-3 flex flex-nowrap gap-1">
            {tags.map((tag) => (
              <span
                className="rounded-lg text-xs bg-gray-400 py-[3px] px-2 italic"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
}
