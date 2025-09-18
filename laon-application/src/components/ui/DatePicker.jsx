'use client';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { forwardRef, useState } from 'react';

const datePickerClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed relative',
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

const DatePicker = forwardRef(({
  // Required parameters with defaults (converted to valid Tailwind)
  placeholder = "Pick a date",
  text_font_size = "text-sm",
  text_font_family = "Inter",
  text_font_weight = "font-normal",
  text_line_height = "leading-sm",
  text_text_align = "center",
  text_color = "text-input-text",
  fill_background_color = "bg-input-background",
  border_border = "1px solid #e2e8f0",
  border_border_radius = "rounded-sm",
  
  // Optional parameters (no defaults)
  layout_gap,
  layout_width,
  padding,
  position,
  
  // Standard React props
  variant,
  size,
  disabled = false,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  required = false,
  min,
  max,
  ...props
}, ref) => {
  const [inputValue, setInputValue] = useState(value || '')

  // Safe validation for optional parameters
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== ''
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== ''
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== ''

  const optionalClasses = [
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
  ]?.filter(Boolean)?.join(' ')

  // Build custom styles for non-Tailwind properties
  const customStyles = {
    // Only use inline styles for truly custom values
    ...(text_font_family && !text_font_family?.startsWith('font-') && { fontFamily: text_font_family }),
  }

  // Build Tailwind classes for styling
  const styleClasses = [
    text_font_size,
    text_font_family?.startsWith('font-') ? text_font_family : '',
    text_font_weight,
    text_line_height,
    `text-${text_text_align}`,
    text_color,
    // Only apply these if not using variant system
    !variant ? fill_background_color : '',
    !variant ? `border-[${border_border?.split(' ')?.[2]}]` : '',
    border_border_radius,
  ]?.filter(Boolean)?.join(' ')

  const handleChange = (event) => {
    const newValue = event?.target?.value
    setInputValue(newValue)
    
    if (typeof onChange === 'function') {
      onChange(event)
    }
  }

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type="date"
        placeholder={placeholder}
        disabled={disabled}
        value={inputValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        id={id}
        required={required}
        min={min}
        max={max}
        style={customStyles}
        className={twMerge(
          datePickerClasses({ variant, size }),
          styleClasses,
          optionalClasses,
          className
        )}
        aria-disabled={disabled}
        {...props}
      />
      {/* Calendar icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-gray-400"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
    </div>
  )
})

DatePicker.displayName = 'DatePicker'

export default DatePicker