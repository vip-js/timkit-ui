'use client'

import { useState } from 'react'
import { cn } from '@timui/core'
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@timui/react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

type CalendarRangeValue = { from: Date | undefined; to?: Date }
type CalendarSelectedValue = Date | Date[] | CalendarRangeValue | undefined

export default function DatePicker() {
  const [date, setDate] = useState<CalendarRangeValue | undefined>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="group bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <CalendarIcon
            size={16}
            className="text-muted-foreground/80 -ms-1 shrink-0 transition-colors"
            aria-hidden="true"
          />
          <span className={cn('truncate', !date && 'font-medium')}>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              'Date'
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={(next: CalendarSelectedValue) =>
            setDate(next as CalendarRangeValue | undefined)
          }
        />
      </PopoverContent>
    </Popover>
  )
}
