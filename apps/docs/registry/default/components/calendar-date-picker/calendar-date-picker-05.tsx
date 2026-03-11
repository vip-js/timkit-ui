'use client'

import { useState } from 'react'
import { Calendar } from '@timui/react'
import { addDays } from 'date-fns'

type CalendarRangeValue = { from: Date | undefined; to?: Date }
type CalendarSelectedValue = Date | Date[] | CalendarRangeValue | undefined

export default function Component() {
  const today = new Date()
  const [date, setDate] = useState<CalendarRangeValue | undefined>({
    from: today,
    to: addDays(today, 3),
  })

  return (
    <div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={(next: CalendarSelectedValue) => setDate(next as CalendarRangeValue | undefined)}
        className="rounded-md border p-2"
      />
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Range calendar -{' '}
        <a
          className="hover:text-foreground underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  )
}
