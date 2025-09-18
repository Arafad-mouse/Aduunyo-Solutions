"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  selectionMode?: 'single' | 'range' | 'multiple'
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectionMode = 'single',
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 bg-white rounded-lg shadow-lg border border-gray-200",
        className
      )}
      classNames={{
        months: "flex flex-col w-full",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center mb-4 px-1",
        caption_label: "text-base font-semibold text-gray-900",
        nav: "flex items-center gap-2",
        nav_button:
          "h-8 w-8 p-0 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors",
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",
        table: "w-full border-collapse",
        head_row: "flex justify-between mb-2",
        head_cell: "w-9 text-center text-sm font-medium text-gray-500",
        row: "flex w-full mt-2 justify-between",
        cell: "h-9 w-9 p-0 text-center text-sm relative [&:has([aria-selected])]:bg-transparent",
        day: "h-9 w-9 p-0 font-normal text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center",
        day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700",
        day_today: "bg-blue-50 text-blue-700 font-medium",
        day_outside: "text-gray-400 hover:bg-transparent cursor-not-allowed",
        day_disabled: "text-gray-300 hover:bg-transparent cursor-not-allowed",
        day_range_middle: "bg-blue-100 text-blue-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        ),
        IconRight: () => (
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        ),
      }}
      mode={selectionMode}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
