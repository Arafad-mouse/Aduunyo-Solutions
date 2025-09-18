'use client';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonClasses = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-background text-primary-foreground hover:bg-primary-dark focus:ring-primary-background',
        secondary: 'bg-secondary-background text-secondary-foreground hover:bg-secondary-light focus:ring-secondary-background border border-button-border',
        outline: 'border-2 border-primary-background text-primary-background bg-transparent hover:bg-primary-light hover:text-primary-foreground focus:ring-primary-background',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
)

const Button = ({
  // Required parameters with defaults (converted to valid Tailwind)
  text = "",
  text_font_size = "text-sm",
  text_font_family = "Inter",
  text_font_weight = "font-medium",
  text_line_height = "leading-sm",
  text_text_align = "center",
  text_color = "text-secondary-dark",
  fill_background_color = "bg-secondary-background",
  border_border = "1px solid #e2e8f0",
  border_border_radius = "rounded-md",
  effect_box_shadow = "shadow-[0px_1px_2px_#0000000c]",
  
  // Optional parameters (no defaults)
  layout_width,
  padding,
  margin,
  position,
  
  // Standard React props
  variant,
  size,
  disabled = false,
  className,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  // Safe validation for optional parameters
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== ''
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== ''
  const hasValidMargin = margin && typeof margin === 'string' && margin?.trim() !== ''
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== ''

  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidMargin ? `m-[${margin}]` : '',
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
    !variant ? `border border-[${border_border?.split(' ')?.[2]}]` : '',
    border_border_radius,
    effect_box_shadow,
  ]?.filter(Boolean)?.join(' ')

  const handleClick = (event) => {
    if (disabled) {
      event?.preventDefault()
      return
    }
    
    if (typeof onClick === 'function') {
      onClick(event)
    }
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={customStyles}
      className={twMerge(
        buttonClasses({ variant, size }),
        styleClasses,
        optionalClasses,
        className
      )}
      aria-disabled={disabled}
      {...props}
    >
      {children || text}
    </button>
  )
}

export default Button