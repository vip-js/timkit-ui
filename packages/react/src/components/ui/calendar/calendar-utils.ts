import { CalendarDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'

import type { CalendarMode, CalendarSelectedValue, DisabledMatcher } from './calendar-types'

const toDateOnly = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
export const toMonthEnd = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
export const addMonths = (date: Date, count: number) =>
  new Date(date.getFullYear(), date.getMonth() + count, 1)

export const toDateValue = (date: Date) =>
  new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

export const isRangeValue = (
  value: CalendarSelectedValue
): value is Exclude<CalendarSelectedValue, Date | Date[] | undefined> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)

export const dateFromSelected = (selected: CalendarSelectedValue, mode: CalendarMode) => {
  if (!selected) return undefined
  if (selected instanceof Date) return selected
  if (Array.isArray(selected) && mode === 'multiple') return selected[0]
  if (isRangeValue(selected)) return selected.from ?? selected.to
  return undefined
}

export const selectedToDateValues = (selected: CalendarSelectedValue, mode: CalendarMode) => {
  if (!selected) return undefined
  if (mode === 'single') {
    if (selected instanceof Date) return [toDateValue(selected)]
    if (isRangeValue(selected)) {
      const fallback = selected.from ?? selected.to
      return fallback ? [toDateValue(fallback)] : undefined
    }
    return undefined
  }

  if (mode === 'multiple') {
    if (!Array.isArray(selected)) return undefined
    const values = selected.map(toDateValue)
    return values.length > 0 ? values : undefined
  }

  if (!isRangeValue(selected)) return undefined
  const values: DateValue[] = []
  if (selected.from) values.push(toDateValue(selected.from))
  if (selected.to) values.push(toDateValue(selected.to))
  return values.length > 0 ? values : undefined
}

export const valuesToSelected = (values: DateValue[], mode: CalendarMode, timeZone: string) => {
  if (mode === 'single') {
    return values[0]?.toDate(timeZone)
  }

  if (mode === 'multiple') {
    const dates = values.map((value) => value.toDate(timeZone))
    return dates.length > 0 ? dates : undefined
  }

  const from = values[0]?.toDate(timeZone)
  const to = values[1]?.toDate(timeZone)
  return from || to ? { from, to } : undefined
}

export const compareMonth = (a: Date, b: Date) =>
  a.getFullYear() - b.getFullYear() || a.getMonth() - b.getMonth()

export const clampMonth = (date: Date, min?: Date, max?: Date) => {
  if (min && compareMonth(date, min) < 0) return min
  if (max && compareMonth(date, max) > 0) return max
  return date
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const isMatchObject = (
  date: Date,
  matcher: {
    before?: Date
    after?: Date
    from?: Date
    to?: Date
    dayOfWeek?: number[]
  }
) => {
  const current = toDateOnly(date).getTime()
  const before = matcher.before ? toDateOnly(matcher.before).getTime() : undefined
  const after = matcher.after ? toDateOnly(matcher.after).getTime() : undefined
  const from = matcher.from ? toDateOnly(matcher.from).getTime() : undefined
  const to = matcher.to ? toDateOnly(matcher.to).getTime() : undefined
  const weekdayMatched = Array.isArray(matcher.dayOfWeek) && matcher.dayOfWeek.includes(date.getDay())

  if (from !== undefined || to !== undefined) {
    const min = from ?? Number.NEGATIVE_INFINITY
    const max = to ?? Number.POSITIVE_INFINITY
    if (current >= min && current <= max) return true
  }

  if (before !== undefined && current < before) return true
  if (after !== undefined && current > after) return true
  if (weekdayMatched) return true
  return false
}

export const matchDisabled = (date: Date, matcher: DisabledMatcher) => {
  if (matcher instanceof Date) return isSameDay(date, matcher)
  if (typeof matcher === 'function') return matcher(date)
  return isMatchObject(date, matcher)
}

export const hasUnavailableBetween = (
  from: Date,
  to: Date,
  isUnavailable: (date: Date) => boolean
) => {
  const start = toDateOnly(from)
  const end = toDateOnly(to)
  const min = start.getTime() <= end.getTime() ? start : end
  const max = start.getTime() <= end.getTime() ? end : start
  for (let cursor = new Date(min); cursor.getTime() <= max.getTime(); cursor.setDate(cursor.getDate() + 1)) {
    if (isUnavailable(cursor)) return true
  }
  return false
}

export const getIsoWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
