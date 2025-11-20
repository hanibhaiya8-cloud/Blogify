"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { DateRange as ReactDayPickerDateRange } from "react-day-picker"

type DateRange = {
  from: Date
  to: Date
}

interface DatePickerWithRangeProps {
  value?: DateRange | null
  onChange?: (range: DateRange | undefined) => void
  className?: string
}

export function DatePickerWithRange({ value, onChange, className }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (range: ReactDayPickerDateRange | undefined) => {
    if (range?.from) {
      onChange?.(range as DateRange)
      if (range.to) {
        setIsOpen(false)
      }
    } else {
      onChange?.(undefined)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value || undefined}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
