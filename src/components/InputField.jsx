import React from "react";

import { Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

export default function InputField({
  label,
  placeholder,
  type,
  value,
  ...rest
}) {
  return (
    <div className="w-full max-w-md">
      <Field>
        <Label className="text-sm/6 font-medium text-white">{label}</Label>
        <Input
          type={type ?? "text"}
          className={clsx(
            "mt-1 block w-full rounded-lg border-none bg-gray-600 py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
          )}
          placeholder={placeholder}
          value={value}
          {...rest}
        />
      </Field>
    </div>
  );
}

// export default function InputField({ label, placeholder }) {
//   return (
//     <div className="flex flex-col">
//       <label
//         for="email"
//         class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//       >
//         {label}
//       </label>
//       <input
//         type="text"
//         id="email"
//         class="bg-gray-50 border outline-0 border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//         placeholder={placeholder}
//       />
//     </div>
//   );
// }
