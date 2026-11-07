import { emitTimEvent } from '../utils'
import { setupDateFieldMachine } from './use-datefield'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type DatePoint = {
  set: (fields: { year: number; month: number; day: number }) => DatePoint
}

type WeappDateFieldApi = {
  valueAsString?: string[]
  focusedValue?: DatePoint
  setValue?: (value: DatePoint[]) => void
  clearValue?: () => void
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

const toIso = (raw: string) => {
  const parsed = parseDay(raw)
  if (!parsed) return ''
  return `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`
}

const dayStamp = (raw: string) => {
  const parsed = parseDay(raw)
  if (!parsed) return undefined
  return parsed.year * 10000 + parsed.month * 100 + parsed.day
}

const outsideRange = (value: string, min: string, max: string) => {
  const day = dayStamp(value)
  if (day == null) return false
  const low = dayStamp(min)
  const high = dayStamp(max)
  return (low != null && day < low) || (high != null && day > high)
}

type WeappService = {
  setContext: (context: {
    value?: string[]
    min?: string[]
    max?: string[]
    disabled?: boolean
  }) => void
}

type DateFieldChangeDetails = {
  valueAsString?: string[]
}

type PickerChangeEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappDateFieldInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    _connect?: (state: object, send: (event: MachineEvent) => void) => WeappDateFieldApi
    data: {
      api: WeappDateFieldApi
      pickerValue: string
    }
    applyValue?: (val: unknown) => void
    properties: {
      value: string[]
      min: string
      max: string
      disabled: boolean
      readOnly: boolean
      placeholder: string
      format: string
      id: string
      extClass: string
    }
  }

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    min: { type: String, value: '' },
    max: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    placeholder: { type: String, value: 'Date' },
    'aria-label': { type: String, value: '' },
    format: { type: String, value: 'yyyy-MM-dd' },
    id: { type: String, value: 'datefield' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappDateFieldApi,
    className: '',
    pickerValue: '',
    dayStatus: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappDateFieldInternal
      const passed = this.properties.value
      const initial = passed == null ? this.properties.defaultValue : passed
      const { service, start, send, connect } = setupDateFieldMachine(this, {
        id: this.properties.id,
        value: initial,
        disabled: this.properties.disabled,
        onValueChange: (details: DateFieldChangeDetails) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'datefield', {
            value: details.valueAsString || [],
          })
          this.updatePickerValue(details.valueAsString?.[0])
        },
      })

      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
      self.applyValue?.(initial)
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
    },
    detached() {
      const self = this as WeappDateFieldInternal
      self._cleanup?.()
    },
  },

  observers: {
    value: function (val) {
      ;(this as WeappDateFieldInternal).applyValue?.(val)
    },
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    state: function (state) {
      const self = this as WeappDateFieldInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappDateFieldApi
      this.setData({
        api,
        className: this.properties.extClass,
        pickerValue: toIso(api.valueAsString?.[0] || ''),
        dayStatus: this.dayText(toIso(api.valueAsString?.[0] || '')),
      })
    },
  },

  methods: {
    applyValue(val: unknown) {
      const self = this as WeappDateFieldInternal
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
      if (!focused?.set) {
        const next = toIso(raws[0]) || raws[0]
        this.setData({ pickerValue: next, dayStatus: this.dayText(next) })
        return
      }
      const dates = raws.map((item) => parseDay(item)).filter((item) => item !== undefined)
      if (!dates.length) return
      self.data.api.setValue?.(dates.map((item) => focused.set(item)))
    },
    dayText(value: string) {
      return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''
    },
    updatePickerValue(value?: string) {
      const next = toIso(value || '') || value || ''
      this.setData({ pickerValue: next, dayStatus: this.dayText(next) })
    },
    onPickerChange(e: PickerChangeEvent) {
      const self = this as WeappDateFieldInternal
      if (this.properties.disabled || this.properties.readOnly) return
      const value = e.detail.value
      if (outsideRange(value, String(this.properties.min || ''), String(this.properties.max || ''))) return
      if (this.properties.value != null) {
        this.triggerEvent('change', { value: [value] })
        return
      }
      const [year, month, day] = value.split('-').map(Number)
      const next = self.data.api.focusedValue?.set({ year, month, day })
      if (!next) return
      self.data.api.setValue?.([next])
      this.updatePickerValue(value)
    },
  },
})
