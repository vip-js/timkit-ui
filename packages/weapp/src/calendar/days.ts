export type CalendarDayCell = {
  key: string
  label: string
  name: string
  value: string
  selected: boolean
  focused: boolean
  outside: boolean
  disabled: boolean
  today: boolean
}

type DayValue = {
  year: number
  month: number
  day: number
  toString: () => string
  add: (duration: { months?: number; days?: number }) => DayValue
}

type GridApi = {
  visibleRange?: { start?: DayValue }
  numOfMonths?: number
  weekDays?: Array<{ short?: string; long?: string }>
  format?: (value: DayValue, opts: { month: 'long'; year: 'numeric' }) => string
  getMonthWeeks?: (month: DayValue) => DayValue[][]
  getDayTableCellState?: (props: {
    value: DayValue
    visibleRange: { start: DayValue; end: DayValue }
    disabled?: boolean
  }) => {
    selected?: boolean
    inRange?: boolean
    focused?: boolean
    outsideRange?: boolean
    disabled?: boolean
    unavailable?: boolean
    selectable?: boolean
    today?: boolean
  }
  getDayTableCellTriggerProps?: (props: {
    value: DayValue
    visibleRange: { start: DayValue; end: DayValue }
    disabled?: boolean
  }) => { 'aria-label'?: string }
}

const isoDay = (day: { year: number; month: number; day: number }) => {
  const month = String(day.month).padStart(2, '0')
  const date = String(day.day).padStart(2, '0')
  return `${day.year}-${month}-${date}`
}

const usDay = (day: { year: number; month: number; day: number }) => {
  const month = String(day.month).padStart(2, '0')
  const date = String(day.day).padStart(2, '0')
  return `${month}/${date}/${day.year}`
}

type MonthApi = {
  getPrevTriggerProps?: (opts: { view: 'day' }) => {
    onClick?: (event: { preventDefault: () => void; stopPropagation: () => void }) => void
    'aria-label'?: string
  }
  getNextTriggerProps?: (opts: { view: 'day' }) => {
    onClick?: (event: { preventDefault: () => void; stopPropagation: () => void }) => void
    'aria-label'?: string
  }
}

type KeyApi = {
  getTableProps?: (props: { view: 'day' }) => {
    onKeyDown?: (event: {
      key: string
      shiftKey: boolean
      defaultPrevented: boolean
      preventDefault: () => void
      stopPropagation: () => void
    }) => void
  }
}

export function pressDayKey(api: KeyApi, key: string, shiftKey = false) {
  if (!key) return
  const props = api.getTableProps?.({ view: 'day' })
  props?.onKeyDown?.({
    key,
    shiftKey,
    defaultPrevented: false,
    preventDefault() {},
    stopPropagation() {},
  })
}

export function monthLabels(api: MonthApi) {
  return {
    prevLabel: api.getPrevTriggerProps?.({ view: 'day' })?.['aria-label'] || 'Switch to previous month',
    nextLabel: api.getNextTriggerProps?.({ view: 'day' })?.['aria-label'] || 'Switch to next month',
  }
}

export function pressMonth(api: MonthApi, direction: 'prev' | 'next') {
  const props = direction === 'prev' ? api.getPrevTriggerProps?.({ view: 'day' }) : api.getNextTriggerProps?.({ view: 'day' })
  props?.onClick?.({ preventDefault() {}, stopPropagation() {} })
}

export function calendarGrid(
  api: GridApi,
  disabled: boolean,
  blocked: string[],
  bounds?: { start?: number; end?: number }
) {
  const start = api.visibleRange?.start
  if (!start?.add || !api.getMonthWeeks) {
    return { caption: '', weekdays: [] as string[], days: [] as CalendarDayCell[], weeks: [] as CalendarDayCell[][] }
  }
  const count = Math.max(1, api.numOfMonths || 1)
  const blockedKeys = new Set(blocked.map(String))
  const weekdays = (api.weekDays ?? []).map((day) => day.short || day.long || '').filter(Boolean)
  const days: CalendarDayCell[] = []
  for (let index = 0; index < count; index += 1) {
    const monthStart = start.add({ months: index })
    const visibleRange = { start: monthStart, end: monthStart.add({ months: 1 }).add({ days: -1 }) }
    for (const week of api.getMonthWeeks(monthStart) ?? []) {
      for (const day of week) {
        const value = isoDay(day)
        const state = api.getDayTableCellState?.({ value: day, visibleRange, disabled })
        const blockedDay = blockedKeys.has(value) || blockedKeys.has(usDay(day))
        const monthIndex = day.year * 12 + day.month
        const outsideBounds = (bounds?.start != null && monthIndex < bounds.start) || (bounds?.end != null && monthIndex > bounds.end)
        const cellProps = { value: day, visibleRange, disabled }
        const trigger = api.getDayTableCellTriggerProps?.(cellProps)
        const label = String(day.day)
        days.push({
          key: `${index}-${value}`,
          label,
          name: trigger?.['aria-label'] || label,
          today: !!state?.today,
          value,
          selected: !!state?.selected || !!state?.inRange,
          focused: !!state?.focused,
          outside: !!state?.outsideRange,
          disabled:
            disabled ||
            outsideBounds ||
            blockedDay ||
            !!state?.disabled ||
            !!state?.unavailable ||
            state?.selectable === false,
        })
      }
    }
  }
  const weeks: CalendarDayCell[][] = []
  for (let index = 0; index < days.length; index += 7) weeks.push(days.slice(index, index + 7))
  return {
    caption: api.format?.(start, { month: 'long', year: 'numeric' }) ?? '',
    weekdays,
    days,
    weeks,
  }
}
