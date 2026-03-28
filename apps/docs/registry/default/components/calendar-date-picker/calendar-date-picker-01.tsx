'use client'

import { useState } from 'react'
import { Calendar } from '@timui/react'

export default function Component() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div>
      <Calendar
        className="rounded-md border p-2"
        mode="single"
        selected={date}
        onSelect={(next) => setDate(next instanceof Date ? next : undefined)}
      />
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Calendar -{' '}
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
