"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

interface CalendarDropdownProps {
  value?: string | number
  onChange?: (value: string | number) => void
  options?: Array<{ value: string | number; label: string }>
}

const CalendarDropdown = ({ value, onChange, options = [] }: CalendarDropdownProps) => {
  const selected = options?.find((opt) => opt.value.toString() === value?.toString())

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-8 rounded-md border border-input bg-background px-2 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 bg-[#f9f9f9] dark:bg-[#1a1a1a] rounded-2xl shadow-sm border border-border",
        className
      )}
      classNames={{
        months:
          "flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center",
        month: "space-y-3",
        caption:
          "flex justify-center items-center relative text-center font-semibold text-base",
        caption_label: "text-sm font-medium text-foreground",
        nav: "flex items-center gap-2 absolute right-0",
        nav_button:
          "flex items-center justify-center h-8 w-8 rounded-full transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary",
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "w-9 h-9 text-[0.75rem] font-medium text-muted-foreground text-center",
        row: "flex w-full",
        cell: cn(
          "relative h-9 w-9 p-0 text-center text-sm",
          "first:[&:has([aria-selected])]:rounded-l-full",
          "last:[&:has([aria-selected])]:rounded-r-full"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal rounded-full transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 focus:text-primary-foreground",
        day_today:
          "border border-primary text-primary font-semibold bg-primary/10",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-primary/20 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-30",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ ...props }) => {
          // Remove the label text but keep the dropdown functionality
          if (props.name === 'months' || props.name === 'years') {
            return (
              <select
                {...props}
                className="bg-transparent border-none focus:ring-0 focus:ring-offset-0 p-0 m-0 [&>option]:text-foreground [&>option]:bg-background"
                style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
              />
            );
          }
          return null;
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }