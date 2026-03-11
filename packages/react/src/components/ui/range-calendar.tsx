'use client'

import * as React from 'react'

import { Calendar } from './calendar'

function RangeCalendar(props: React.ComponentProps<typeof Calendar>) {
  return <Calendar mode="range" {...props} />
}

export { RangeCalendar }
