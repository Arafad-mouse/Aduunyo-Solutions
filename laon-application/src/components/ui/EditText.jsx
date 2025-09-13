'use client';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

const editTextClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'border border-input-border bg-input-background text-input-text focus:ring-primary-background focus:border-primary-background',
        error: 'border border-red-500 bg-input-background text-red-600 focus:ring-red-500 focus:border-red-500',
        success: 'border border-green-500 bg-input-background text-green-600 focus:ring-green-500 focus:border-green-500',
      },
      size: {
        small: 'text-sm px-2 py-1',
        medium: 'text-sm px-3 py-2',
        large: 'text-base px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
)

const EditText = forwardRef(({
  label,
  placeholder = "Input Value",
  variant,
  size,
  type = 'text',
  disabled = false,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  required = false,
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
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className={twMerge(
          editTextClasses({ variant, size }),
          className
        )}
        aria-disabled={disabled}
        {...props}
      />
    </div>
  );
});

EditText.displayName = 'EditText'

export default EditText