'use client';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { forwardRef, useState } from 'react';

const checkboxClasses = cva(
  'flex items-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: '',
        error: 'text-red-600',
        success: 'text-green-600',
      },
      size: {
        small: 'text-sm gap-2',
        medium: 'text-base gap-3',
        large: 'text-lg gap-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
)

const checkboxInputClasses = cva(
  'rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-background',
  {
    variants: {
      variant: {
        default: 'border-input-border text-primary-background focus:border-primary-background',
        error: 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 text-green-600 focus:border-green-500 focus:ring-green-500',
      },
      size: {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
)

const CheckBox = forwardRef(({
  label,
  variant,
  size,
  disabled = false,
  className,
  checked,
  onChange,
  name,
  id,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <label
      htmlFor={inputId}
      className={twMerge(
        checkboxClasses({ variant, size }),
        'flex items-center',
        className
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={twMerge(
          checkboxInputClasses({ variant, size }),
          'flex-shrink-0'
        )}
        {...props}
      />
      {label && <span className="select-none text-sm text-gray-700">{label}</span>}
    </label>
  );
});

CheckBox.displayName = 'CheckBox'

export default CheckBox