'use client'

import { DatePicker, Label } from '@timui/react'

export default function Component() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const disabledRanges = [
    [new Date(today), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)],
    [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 16),
    ],
    [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 23),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 24),
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
    <div className="*:not-first:mt-2">
      <Label className="text-foreground text-sm font-medium">
        Date range picker (unavailable dates)
      </Label>
      <DatePicker
        mode="range"
        calendarProps={{
          disabled: [{ before: today }, isDateUnavailable],
        }}
      />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with TimUI atomic components + core Zag machine
      </p>
    </div>
  )
}
