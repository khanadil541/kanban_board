import React, { useState } from "react";
import { motion } from "framer-motion";
import InputField from "./InputField";
import SelectBox from "./Select";
import { Label, Textarea, Field } from "@headlessui/react";
import clsx from "clsx";
import DateTimePicker from "./DateTimePicker";
import { useFormik } from "formik";
import { PRIORITIES, STATUSES, getTaskById } from "../_helper";
import axios from "axios";
import { useTask } from "../Context/TaskContext";
export default function CreateUpdateTask({ taskId }) {
  const { onTaskCreate, setShowModal, tasks } = useTask();
  const formik = useFormik({
    initialValues: getTaskById(taskId, tasks),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let res;
        if (taskId) {
          res = await axios.put(
            `https://shrimo.com/fake-api/todos/${taskId}`,
            values
          );
        } else {
          res = await axios.post("https://shrimo.com/fake-api/todos", values);
        }

        if (res.data) {
          setShowModal(false);
          onTaskCreate(res?.data?.data, taskId);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false); // Ensure button is re-enabled
      }
    },
  });
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !formik.values.tags.includes(tagInput.trim())) {
      formik.setFieldValue("tags", [...formik.values.tags, tagInput.trim()]);
      setTagInput(""); // Clear input after adding
    }
  };

  const handleRemoveTag = (tag) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((t) => t !== tag)
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed w-full h-full bottom-0 top-0 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="max-w-[56rem] w-full max-h-full p-4 bg-gray-800 rounded-xl relative">
        <form onSubmit={formik.handleSubmit}>
          <i
            className="fa fa-times text-xl absolute right-5 top-5 cursor-pointer"
            onClick={() => setShowModal(false)}
          ></i>
          <h2 className="text-xl font-bold">
            {taskId ? "Update Task" : "Create New Task"}
          </h2>

          <div className="grid grid-cols-2 py-2 gap-3">
            <div>
              <InputField
                label={"Title"}
                placeholder={"Enter title Here"}
                value={formik.values.title}
                onChange={formik.handleChange}
                name="title"
              ></InputField>
              <Field className={"mt-3"}>
                <Label className="text-sm/6 font-medium text-white">
                  Description
                </Label>

                <Textarea
                  className={clsx(
                    "mt-1 block w-full resize-none rounded-lg border-none bg-gray-600 py-1.5 px-3 text-sm/6 text-white",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                  rows={7}
                  name={"description"}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  placeholder="Enter Description Here"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-3">
              <SelectBox
                label="Status"
                options={STATUSES}
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
              ></SelectBox>
              <SelectBox
                label="Priority"
                options={PRIORITIES}
                name="priority"
                onChange={formik.handleChange}
                value={formik.values.priority}
              ></SelectBox>
              <div className="flex items-end gap-2">
                <InputField
                  label={"Tags"}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                ></InputField>
                <button
                  className="bg-blue-600 text-white rounded-lg py-1.5 px-4"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formik.values.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-white text-sm px-3 py-1 rounded-lg flex items-center gap-2"
                  >
                    <button
                      type="button"
                      className="text-red-400 text-sm cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                    {tag}
                  </span>
                ))}
              </div>
              <DateTimePicker
                name="dueDate"
                label={"Due Date"}
                selected={formik.values.dueDate}
                onChange={(date) => formik.setFieldValue("dueDate", date)}
              ></DateTimePicker>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded py-2 px-4 flex items-center gap-2"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Processing...
                </>
              ) : taskId ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
