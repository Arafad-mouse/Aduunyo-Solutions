"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarDemoProps {
  onDateChange?: (date: Date | undefined) => void;
  value?: Date;
}

export function CalendarDemo({ onDateChange, value }: CalendarDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  return (
    <div className="flex flex-col gap-3 w-full">
      <Label htmlFor="date" className="px-1 text-gray-700">
        Date of birth
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id="date"
            className={cn(
              "w-full justify-between text-left font-normal bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
              !date && "text-gray-500"
            )}
          >
            {date ? format(date, "PPP") : <span>Select date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              onDateChange?.(selectedDate);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
