import React, { forwardRef, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputField from "./InputField";
import { Button, Label, Field } from "@headlessui/react";
import clsx from "clsx";
export default function DateTimePicker({ label, selected, ...rest }) {
  const CustomInput = forwardRef(({ value, onClick, className }, ref) => (
    <Button
      label={"Due Date"}
      onClick={onClick}
      ref={ref}
      className={clsx(
        "mt-1 block w-full text-left rounded-lg border-none bg-gray-600 py-1.5 px-3 text-sm/6 text-white",
        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
      )}
    >
      {value}
    </Button>
  ));
  return (
    <Field className={"flex flex-col"}>
      <Label className="text-sm/6 font-medium text-white">
        {label || "Due Date"}
      </Label>
      <DatePicker
        selected={selected}
        minDate={new Date()}
        customInput={<CustomInput></CustomInput>}
        {...rest}
      ></DatePicker>
    </Field>
  );
}
