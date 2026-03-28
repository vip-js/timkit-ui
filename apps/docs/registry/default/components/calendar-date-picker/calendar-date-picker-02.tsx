'use client'

import { useState } from 'react'
import { RangeCalendar, type CalendarRangeValue } from '@timui/react'

export default function Component() {
  const now = new Date()
  const [date, setDate] = useState<CalendarRangeValue>({
    from: now,
    to: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
  })

  return (
    <div>
      <RangeCalendar
        className="rounded-md border p-2"
        selected={date}
        onSelect={(next) => {
          if (next && typeof next === 'object' && !Array.isArray(next) && !(next instanceof Date)) {
            setDate(next as CalendarRangeValue)
          }
        }}
      />
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Range calendar -{' '}
        <a
          className="hover:text-foreground underline"
          href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html"
          target="_blank"
          rel="noopener nofollow"
        >
          React Aria
        </a>
      </p>
    </div>
  )
}
