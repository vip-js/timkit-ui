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
    to: addDays(today, 25),
  })

  return (
    <div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={(next: CalendarSelectedValue) => setDate(next as CalendarRangeValue | undefined)}
        numberOfMonths={2}
        pagedNavigation
        showOutsideDays={false}
        className="rounded-md border p-2"
        classNames={{
          months: 'gap-8',
          month:
            'relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4',
        }}
      />
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Two months calendar -{' '}
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
