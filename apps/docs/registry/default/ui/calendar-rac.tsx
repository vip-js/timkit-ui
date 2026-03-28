'use client'

import * as React from 'react'

import { Calendar } from './calendar'
import { RangeCalendar } from './range-calendar'

type CalendarRACProps = React.ComponentProps<typeof Calendar>
type RangeCalendarRACProps = React.ComponentProps<typeof RangeCalendar>

function CalendarRAC(props: CalendarRACProps) {
  return <Calendar {...props} />
}

function RangeCalendarRAC(props: RangeCalendarRACProps) {
  return <RangeCalendar {...props} />
}

export { CalendarRAC, RangeCalendarRAC }
