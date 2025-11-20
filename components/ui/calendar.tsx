"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, type CaptionLayout } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "buttons" as CaptionLayout,
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatCaption: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "w-fit",
        months: "flex gap-4 flex-col md:flex-row relative",
        month: "flex flex-col w-full gap-4",
        nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0"
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0"
        ),
        caption: "flex items-center justify-center h-8 w-full px-2",
        dropdown: "w-full flex items-center text-sm font-medium justify-center h-8 gap-1.5",
        dropdown_month: "relative border border-input rounded-md",
        dropdown_year: "relative border border-input rounded-md",
        caption_label: cn(
          "select-none font-medium text-sm"
        ),
        table: "w-full border-collapse mt-2",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        day_range_middle: "bg-accent/50 text-accent-foreground hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground",
        day_range_end: "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeftIcon className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRightIcon className="h-4 w-4" {...props} />
        ),
        IconDropdown: ({ ...props }) => (
          <ChevronDownIcon className="h-4 w-4" {...props} />
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<"button"> & { day: Date; modifiers?: { today?: boolean; selected?: boolean; disabled?: boolean; outside?: boolean } }) {
  const isToday = modifiers?.today
  const isSelected = modifiers?.selected
  const isDisabled = modifiers?.disabled
  const isOutside = modifiers?.outside

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({
          variant: isSelected ? "default" : "ghost",
          size: "sm",
          className: cn(
            "h-8 w-8 p-0 font-normal [.is-between_&]:rounded-none [.is-range-end_&]:rounded-r-md [.is-range-start_&]:rounded-l-md [.is-range_&]:rounded-none",
            isToday && "border border-border",
            isSelected && "border border-border",
            isDisabled && "opacity-50",
            isOutside && "text-muted-foreground opacity-50",
            className
          ),
        })
      )}
      disabled={isDisabled}
      {...props}
    >
      {day.getDate()}
    </button>
  )
}

export { Calendar, CalendarDayButton }
