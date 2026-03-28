'use client'

import { RangeCalendar } from '@timui/react'

export default function Component() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const disabledRanges = [
    [new Date(today), new Date(today)],
    [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
    ],
    [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 23),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 23),
    ],
  ]

  const isDateUnavailable = (date: Date) =>
    date.getDay() === 0 ||
    date.getDay() === 6 ||
    disabledRanges.some(
      (interval) =>
        date.getTime() >= interval[0].getTime() && date.getTime() <= interval[1].getTime()
    )

  return (
    <div>
      <RangeCalendar
        className="rounded-md border p-2"
        disabled={[{ before: today }, isDateUnavailable]}
      />
      <p
        className="text-muted-foreground mt-4 text-center text-xs"
        role="region"
        aria-live="polite"
      >
        Disabled dates -{' '}
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
