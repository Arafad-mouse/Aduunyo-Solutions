"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
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

interface Calendar22Props {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function Calendar22({ value, onChange }: Calendar22Props) {
  const [open, setOpen] = React.useState(false)
  const date = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="px-1">
        Date of Birth *
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <ChevronDownIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear() - 18}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                onChange(selectedDate.toISOString())
              }
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
