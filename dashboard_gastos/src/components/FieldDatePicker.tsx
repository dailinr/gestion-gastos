// components/DatePicker.tsx
import { format, isFuture } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  width?: string
  bg?: string
  error?: string
}

export function FieldDatePicker({ value, onChange, width = "w-full", bg = "bg-background", error }: DatePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              `${width} justify-start text-left font-normal ${bg}`,
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Elige una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => isFuture(date)} // ❌ deshabilita fechas futuras
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}
