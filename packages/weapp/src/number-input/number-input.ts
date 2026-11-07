import { createControl, type ControlState } from '@timui/core'

import { setupStepperMachine, stepperStartValue } from '../stepper/use-stepper'
import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'

type WeappNumberInputApi = {
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

type NumberInputEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappNumberInputInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    _connect?: (state: object, send: (event: object) => void) => WeappNumberInputApi
    data: {
      api: WeappNumberInputApi
      current: string
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
    id: { type: String, value: 'number-input' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappNumberInputApi,
    className: '',
    current: '0',
    valueStatus: '0',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappNumberInputInternal
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
          emitTimEvent(this, 'change', 'change', this.properties.id || 'number-input', {
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
      const self = this as WeappNumberInputInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappNumberInputInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      const held = this.properties.value
      const current = held === '' ? '' : (api.value ?? self.data.current)
      this.setData({ api, current, valueStatus: this.valueText(current), className: this.properties.extClass })
    },

    value: function (val: string) {
      const self = this as WeappNumberInputInternal
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
      const self = this as WeappNumberInputInternal
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
    onInputKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'ArrowUp') this.onIncrementTap()
      if (key === 'ArrowDown') this.onDecrementTap()
    },
    onDecrementTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappNumberInputInternal
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
      const self = this as WeappNumberInputInternal
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
    onInput(e: NumberInputEvent) {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappNumberInputInternal
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
