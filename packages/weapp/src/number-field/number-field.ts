import { createControl, type ControlState } from '@timui/core'

import { setupStepperMachine, stepperStartValue } from '../stepper/use-stepper'
import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'

type WeappNumberFieldApi = {
  decrement?: () => void
  increment?: () => void
  setValue?: (value: string | number) => void
  value?: string
  isAtMin?: boolean
  isAtMax?: boolean
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type NumberFieldEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappNumberFieldInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    _connect?: (state: object, send: (event: object) => void) => WeappNumberFieldApi
    data: {
      api: WeappNumberFieldApi
      current: string
      ariaLabel: string
      control?: ControlState
    }
    properties: {
      value: string
      min: number
      max: number
      step: number
      disabled: boolean
      readOnly: boolean
      allowMouseWheel: boolean
      clampValueOnBlur: boolean
      id: string
      extClass: string
      invalid: boolean | string | null
      describedBy: string | null
      'aria-label': string
      'aria-labelledby': string
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
    min: { type: Number, value: Number.MIN_SAFE_INTEGER },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    allowMouseWheel: { type: Boolean, value: false },
    clampValueOnBlur: { type: Boolean, value: true },
    id: { type: String, value: 'number-field' },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappNumberFieldApi,
    className: '',
    current: '0',
    valueStatus: '0',
    ariaLabel: '',
    labelledBy: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappNumberFieldInternal
      const label = String(this.properties['aria-label'] || '')
      const labelledBy = String(this.properties['aria-labelledby'] || '')
      if (label !== this.data.ariaLabel || labelledBy !== this.data.labelledBy) {
        this.setData({ ariaLabel: label, labelledBy })
      }
      const { service, start, send, connect } = setupStepperMachine(this, {
        id: this.properties.id,
        value: stepperStartValue(this.properties.value, this.properties.defaultValue),
        min: this.properties.min,
        max: this.properties.max,
        step: this.properties.step,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        allowMouseWheel: this.properties.allowMouseWheel,
        clampValueOnBlur: this.properties.clampValueOnBlur,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'number-field', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: object) => void
      self._connect = connect
      self._cleanup = start()
    },
    detached() {
      const self = this as WeappNumberFieldInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label'(value: unknown) {
      const self = this as WeappNumberFieldInternal
      const next = String(value || '')
      if (next !== self.data.ariaLabel) this.setData({ ariaLabel: next })
    },
    'aria-labelledby'(value: unknown) {
      const self = this as WeappNumberFieldInternal
      const next = String(value || '')
      if (next !== self.data.labelledBy) this.setData({ labelledBy: next })
    },
    state: function (state) {
      const self = this as WeappNumberFieldInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      const held = this.properties.value
      const current = held === '' ? '' : (api.value ?? self.data.current)
      this.setData({
        api,
        current,
        valueStatus: this.valueText(current),
        className: this.properties.extClass,
      })
    },

    value: function (val: string) {
      const self = this as WeappNumberFieldInternal
      if (val == null) return
      if (val === '') {
        this.setData({ current: '', valueStatus: '' })
        return
      }
      if (!self.data.api.setValue || String(val) === String(self.data.current)) return
      self.data.api.setValue(String(val))
    },
    min: function () {
      this.clampBounds()
    },
    max: function () {
      this.clampBounds()
    },
  },

  methods: {
    valueText(current: unknown) {
      if (current === '' || current == null) return ''
      const numeric = Number(current)
      return Number.isFinite(numeric) ? String(numeric) : ''
    },
    clampBounds() {
      if (this.data.current === '') return
      const current = Number(this.data.current)
      if (!Number.isFinite(current)) return
      const low = Number(this.properties.min)
      const high = Number(this.properties.max)
      let next = current
      if (Number.isFinite(low)) next = Math.max(low, next)
      if (Number.isFinite(high)) next = Math.min(high, next)
      if (next === current) return
      const self = this as WeappNumberFieldInternal
      if (this.properties.value == null) {
        this.setData({ current: String(next), valueStatus: this.valueText(next) })
        self.data.api.setValue?.(String(next))
      }
      this.triggerEvent('change', { value: String(next) })
    },
    onDecrementKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onDecrementTap()
    },
    onIncrementKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onIncrementTap()
    },
    onInputKey(event?: { detail?: { key?: string; shiftKey?: boolean } }) {
      const key = String(event?.detail?.key || '')
      const shift = Boolean(event?.detail?.shiftKey)
      if (key === 'ArrowUp') this.stepBy(shift ? 10 : 1)
      if (key === 'ArrowDown') this.stepBy(shift ? -10 : -1)
      if (key === 'PageUp') this.stepBy(10)
      if (key === 'PageDown') this.stepBy(-10)
      if (key === 'Home' && typeof this.properties.min === 'number') this.setTo(this.properties.min)
      if (key === 'End' && typeof this.properties.max === 'number') this.setTo(this.properties.max)
    },
    setTo(next: number) {
      if (this.properties.disabled || this.properties.readOnly || !Number.isFinite(next)) return
      const value = String(next)
      if (this.properties.value != null) {
        this.triggerEvent('change', { value })
        return
      }
      const self = this as WeappNumberFieldInternal
      this.setData({ current: value, valueStatus: this.valueText(value) })
      self.data.api.setValue?.(value)
      this.triggerEvent('change', { value })
    },
    stepBy(count: number) {
      if (this.properties.disabled || this.properties.readOnly || !count) return
      const current = Number(this.data.current)
      if (!Number.isFinite(current)) return
      const step = Number(this.properties.step) || 1
      let next = current + step * count
      const min = this.properties.min
      const max = this.properties.max
      if (typeof min === 'number') next = Math.max(min, next)
      if (typeof max === 'number') next = Math.min(max, next)
      const value = String(next)
      if (this.properties.value != null) {
        this.triggerEvent('change', { value })
        return
      }
      const self = this as WeappNumberFieldInternal
      this.setData({ current: value, valueStatus: this.valueText(value) })
      self.data.api.setValue?.(value)
      this.triggerEvent('change', { value })
    },
    onDecrementTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappNumberFieldInternal
      if (this.properties.value != null) {
        const step = Number(this.properties.step) || 1
        const min = Number(this.properties.min)
        const next = Math.max(Number(this.data.current) - step, Number.isFinite(min) ? min : Number(this.data.current) - step)
        this.triggerEvent('change', { value: String(next) })
        return
      }
      const next = commitControl(self, 'select')
      if (next.disabled) return
      self.data.api.decrement?.()
    },
    onIncrementTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappNumberFieldInternal
      if (this.properties.value != null) {
        const step = Number(this.properties.step) || 1
        const max = Number(this.properties.max)
        const next = Math.min(Number(this.data.current) + step, Number.isFinite(max) ? max : Number(this.data.current) + step)
        this.triggerEvent('change', { value: String(next) })
        return
      }
      const next = commitControl(self, 'select')
      if (next.disabled) return
      self.data.api.increment?.()
    },
    onInput(e: NumberFieldEvent) {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappNumberFieldInternal
      const value = String(e.detail?.value ?? '')
      if (this.properties.value != null) {
        this.triggerEvent('change', { value })
        return
      }
      this.setData({ current: value, valueStatus: this.valueText(value) })
      self.data.api.setValue?.(value)
    },
  },
})
