'use client';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const FileUpload = forwardRef(({
  label,
  onChange,
  name,
  id,
  className,
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
      <div className="relative">
        <input
          ref={ref}
          type="file"
          id={inputId}
          name={name}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        <div className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border border-gray-200 rounded-lg p-2 text-center cursor-pointer">
          Upload document
        </div>
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
