import React from "react";
import { Description, Field, Label, Select } from "@headlessui/react";
import { label } from "framer-motion/client";

export default function SelectBox({ label, options = [], ...rest }) {
  return (
    <div className="w-full max-w-md" {...rest}>
      <Field>
        <Label className="text-sm/6 font-medium text-white mb-2">{label}</Label>
        <div className="relative">
          <Select
            className={
              "mt-1 block w-full appearance-none rounded-lg border-none bg-gray-600 py-1.5 px-3 text-sm/6 text-white" +
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25" +
              // Make the text of each option black on Windows
              "*:text-black"
            }
            {...rest}
          >
            {options.map((op) => {
              if (typeof op === "object") {
                return <option value={op.value}>{op.label}</option>;
              } else {
                return <option value={op}>{op}</option>;
              }
            })}
          </Select>
          <i
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60 fa fa-angle-down"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  );
}
