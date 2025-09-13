'use client';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

const selectClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 rounded-lg appearance-none';

const Select = forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option',
  className,
  value,
  onChange,
  name,
  id,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          ref={ref}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          className={twMerge(selectClasses, className)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
