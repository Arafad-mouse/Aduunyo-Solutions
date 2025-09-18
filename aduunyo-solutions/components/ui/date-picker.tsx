"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
  buttonClassName?: string
  placeholder?: string
}

export function DatePicker({
  label = "Select date",
  value,
  onChange,
  className = "",
  buttonClassName = "",
  placeholder = "Select date"
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value)
    }
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onChange?.(selectedDate)
    setOpen(false)
  }

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {label && (
        <Label htmlFor="date" className="px-1 text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "w-full justify-between font-normal text-left",
              !date ? "text-muted-foreground" : "",
              buttonClassName
            )}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className="border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default DatePicker
