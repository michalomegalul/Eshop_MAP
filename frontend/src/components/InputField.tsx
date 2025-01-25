// InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type, value, onChange }) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-textdark mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 bg-bglight dark:bg-bgdark text-textlight dark:text-bglight transition duration-300 ease-in-out"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
