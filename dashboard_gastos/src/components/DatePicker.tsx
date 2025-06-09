"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAppStore } from "@/Stores/useAppStore"

export function DatePicker({width, bg, tipo} : {width: string, bg: string, tipo: string, pathname: string}) {
  
  const { filterDate } = useAppStore()
  const [date, setDate] = React.useState<Date>()

  // Llamar a filterDate cuando cambia `date`
  React.useEffect(() => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      filterDate(date, tipo)
    }
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `md:${width} justify-start text-left font-normal ${bg} `,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Elige una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
