import { cn } from '../utils'

import { calendarGrid, monthLabels, pressDayKey, pressMonth } from './days'
import { setupCalendarMachine } from './use-calendar'

type DatePoint = {
  add: (duration: { days: number }) => DatePoint
  set: (fields: { year: number; month: number; day: number }) => DatePoint
  year: number
  month: number
  day: number
}

type CalendarApi = {
  focusedValue?: DatePoint
  valueAsString?: string[]
  visibleRange?: { start?: DatePoint; end?: DatePoint }
  numOfMonths?: number
  setValue?: (values: DatePoint[]) => void
  clearValue?: () => void
}

type MachineSend = (event: { type: string; cell: string; value: DatePoint }) => void

type CalendarInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => CalendarApi
  data: { api: CalendarApi; value?: string[]; canPrev?: boolean; canNext?: boolean; caption?: string }
  applyValue?: (val: unknown) => void
  properties: {
    id: string
    mode: string
    numberOfMonths: number
    disabled: boolean
    readOnly: boolean
    disabledDates: string[]
    startMonth: string
    endMonth: string
    value: string[]
    extClass: string
  }
}

const parseDay = (raw: string) => {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
  if (iso) return { year: Number(iso[1]), month: Number(iso[2]), day: Number(iso[3]) }
  const us = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw)
  if (us) return { year: Number(us[3]), month: Number(us[1]), day: Number(us[2]) }
  return undefined
}

const dayKey = (raw: string) => {
  const parsed = parseDay(raw)
  return parsed ? `${parsed.year}-${parsed.month}-${parsed.day}` : raw
}

const dayKeys = (day: { year: number; month: number; day: number }) => {
  const month = String(day.month).padStart(2, '0')
  const date = String(day.day).padStart(2, '0')
  return [`${day.year}-${month}-${date}`, `${month}/${date}/${day.year}`]
}

const orderedRange = (left: string, right: string) => {
  const start = parseDay(left)
  const end = parseDay(right)
  if (!start || !end) return [left, right]
  const later = start.year - end.year || start.month - end.month || start.day - end.day
  return later <= 0 ? [dayKeys(start)[0], dayKeys(end)[0]] : [dayKeys(end)[0], dayKeys(start)[0]]
}

const monthCount = (api: CalendarApi) => {
  const start = api.visibleRange?.start
  const end = api.visibleRange?.end
  if (!start || !end) return api.numOfMonths || 1
  return (end.year - start.year) * 12 + (end.month - start.month) + 1
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    id: { type: String, value: 'calendar' },
    mode: { type: String, value: 'single' },
    numberOfMonths: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    disabledDates: { type: Array, value: [] },
    startMonth: { type: String, value: '' },
    endMonth: { type: String, value: '' },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    extClass: { type: String, value: '' },
  },
  data: {
    api: {} as CalendarApi,
    className: '',
    monthCount: 1,
    value: [] as string[],
    caption: '',
    weekdays: [] as string[],
    days: [] as Array<{ key: string; label: string; name: string; value: string; selected: boolean; outside: boolean; disabled: boolean; today: boolean }>,
    weeks: [] as Array<Array<{ key: string; label: string; name: string; value: string; selected: boolean; outside: boolean; disabled: boolean; today: boolean }>>,
    dayStatus: '',
    canPrev: true,
    canNext: true,
    prevLabel: 'Switch to previous month',
    nextLabel: 'Switch to next month',
  },
  lifetimes: {
    attached() {
      const self = this as CalendarInternal
      const { controller, connect } = setupCalendarMachine(this)
      self._send = controller.send as MachineSend
      self._connect = connect as CalendarInternal['_connect']
      self._cleanup = controller.start()
      const passed = this.properties.value
      self.applyValue?.(passed == null ? this.properties.defaultValue : passed)
    },
    detached() {
      ;(this as CalendarInternal)._cleanup?.()
    },
  },
  observers: {
    value(val: unknown) {
      ;(this as CalendarInternal).applyValue?.(val)
    },
    state(state: object) {
      const self = this as CalendarInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send)
      this.paint(api)
    },
    startMonth() {
      this.paint(this.data.api)
    },
    endMonth() {
      this.paint(this.data.api)
    },
  },
  methods: {
    bounds() {
      const start = parseDay(String(this.properties.startMonth || ''))
      const end = parseDay(String(this.properties.endMonth || ''))
      return {
        start: start ? start.year * 12 + start.month : undefined,
        end: end ? end.year * 12 + end.month : undefined,
      }
    },
    dayText(value: string[]) {
      return value
        .map((item) => {
          const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(item)
          if (us) return `${us[3]}-${us[1].padStart(2, '0')}-${us[2].padStart(2, '0')}`
          return /^\d{4}-\d{2}-\d{2}$/.test(item) ? item : ''
        })
        .filter(Boolean)
        .join(' to ')
    },
    paint(api: CalendarApi) {
      if (!api?.visibleRange) return
      const bounds = this.bounds()
      const visible = api.visibleRange.start
      const visibleIndex = visible ? visible.year * 12 + visible.month : undefined
      const grid = calendarGrid(api, !!this.properties.disabled, this.properties.disabledDates ?? [], bounds)
      this.setData({
        api,
        className: cn('w-fit', this.properties.extClass),
        monthCount: monthCount(api),
        value: (api.valueAsString ?? []).filter(Boolean),
        dayStatus: this.dayText((api.valueAsString ?? []).filter(Boolean)),
        caption: grid.caption,
        weekdays: grid.weekdays,
        days: grid.days,
        weeks: grid.weeks,
        canPrev: bounds.start == null || visibleIndex == null || visibleIndex > bounds.start,
        canNext: bounds.end == null || visibleIndex == null || visibleIndex < bounds.end,
        ...monthLabels(api),
      })
    },
    applyValue(val: unknown) {
      const self = this as CalendarInternal
      if (val == null) return
      const raws = (Array.isArray(val) ? val : val === '' ? [] : [val])
        .map((item) => String(item || ''))
        .filter(Boolean)
      const current = (self.data.api.valueAsString ?? []).map(String).filter(Boolean)
      if (raws.map(dayKey).join('|') === current.map(dayKey).join('|')) return
      if (!raws.length) {
        self.data.api.clearValue?.()
        return
      }
      const focused = self.data.api.focusedValue
      if (!focused?.set) return
      const dates = raws.map((item) => parseDay(item)).filter((item) => item !== undefined)
      if (!dates.length) return
      self.data.api.setValue?.(dates.map((item) => focused.set(item)))
    },
    onKey(event?: { detail?: { key?: string; shiftKey?: boolean }; mark?: { key?: string } }) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      if (this.properties.readOnly && (key === 'Enter' || key === ' ')) return
      pressDayKey(this.data.api, key, event?.detail?.shiftKey === true)
    },
    onPrevKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onPrev()
    },
    onNextKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onNext()
    },
    onPrev() {
      if (this.properties.disabled || this.data.canPrev === false) return
      pressMonth(this.data.api, 'prev')
    },
    onNext() {
      if (this.properties.disabled || this.data.canNext === false) return
      pressMonth(this.data.api, 'next')
    },
    onSelectDate(event?: { mark?: { value?: string } }) {
      const self = this as CalendarInternal
      const parsed = parseDay(String(event?.mark?.value || ''))
      const focused = self.data.api.focusedValue
      if (!parsed || !focused?.set) return
      this.selectDay(focused.set(parsed))
    },
    onSelectDay(event?: { mark?: { offset?: number } }) {
      const self = this as CalendarInternal
      const focused = self.data.api.focusedValue
      if (!focused) return
      const offset = Number(event?.mark?.offset ?? 0)
      this.selectDay(focused.add({ days: offset }))
    },
    selectDay(day: DatePoint) {
      const self = this as CalendarInternal
      if (this.properties.disabled || this.properties.readOnly) return
      const bounds = this.bounds()
      const monthIndex = day.year * 12 + day.month
      if ((bounds.start != null && monthIndex < bounds.start) || (bounds.end != null && monthIndex > bounds.end)) return
      const blocked = (this.properties.disabledDates ?? []).map(String)
      if (dayKeys(day).some((key) => blocked.includes(key))) return
      if (this.properties.value != null) {
        const keys = dayKeys(day)
        const current = (this.data.value || []).map(String)
        const hit = current.some((item) => keys.includes(item) || keys.includes(dayKey(item)))
        const requested =
          this.properties.mode === 'multiple'
            ? hit
              ? current.filter((item) => !keys.includes(item) && !keys.includes(dayKey(item)))
              : [...current, keys[0]]
            : this.properties.mode === 'range'
              ? current.length === 1
                ? orderedRange(current[0], keys[0])
                : [keys[0]]
              : [keys[0]]
        this.triggerEvent('change', { value: requested })
        return
      }
      self._send?.({ type: 'CELL.CLICK', cell: 'day', value: day })
    },
  },
})
