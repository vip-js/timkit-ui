import { createControl, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'
import { setupStepperMachine, stepperStartValue } from './use-stepper'

type WeappStepperApi = {
  value?: string
  decrement?: () => void
  increment?: () => void
  setValue?: (value: string | number) => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type StepperInputEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappStepperInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    _connect?: (state: object, send: (event: object) => void) => WeappStepperApi
    data: {
      api: WeappStepperApi
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
      items: Array<{ label?: string; value?: string | number; disabled?: boolean }>
      orientation: string
      extClass: string
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
    id: { type: String, value: 'stepper' },
    items: { type: Array, value: [] },
    orientation: { type: String, value: 'horizontal' },
    extClass: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
  },

  data: {
    api: {} as WeappStepperApi,
    className: '',
    current: '0',
    ariaLabel: '',
    labelledBy: '',
    rows: [],
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
      const self = this as WeappStepperInternal
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
          emitTimEvent(this, 'change', 'change', this.properties.id || 'stepper', {
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
      const self = this as WeappStepperInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby': function (next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    state: function (state) {
      const self = this as WeappStepperInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      const held = this.properties.value
      const current = held === '' ? '' : (api.value ?? self.data.current)
      const rows = this.rowsFor(current)
      this.setData({
        api,
        current,
        rows,
        stepStatus: this.stepText(rows),
        className: this.properties.extClass,
      })
    },

    value: function (val: string) {
      const self = this as WeappStepperInternal
      if (val == null) return
      if (val === '') {
        if (this.data.current === '') return
        const rows = this.rowsFor('')
        this.setData({ current: '', rows, stepStatus: this.stepText(rows) })
        return
      }
      if (!self.data.api.setValue || String(val) === String(self.data.current)) return
      self.data.api.setValue(String(val))
    },
  },

  methods: {
    stepText(rows: Array<{ state?: string }>) {
      const index = rows.findIndex((row) => row.state === 'active')
      return index < 0 ? '' : `Step ${index + 1} of ${rows.length}`
    },
    rowsFor(current: string | number) {
      const active = current === '' ? Number.NaN : Number(current)
      return (this.properties.items || []).map((item: { label?: string; value?: string | number; disabled?: boolean }, index: number) => {
        const step = Number(item?.value ?? index)
        const state = step === active ? 'active' : step < active ? 'completed' : 'inactive'
        return { ...item, step, state, disabled: item?.disabled === true }
      })
    },
    onStepKey(event: { detail?: { key?: string }; currentTarget?: { dataset?: { index?: number | string } } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') {
        this.onStepTap(event)
        return
      }
      if (this.properties.disabled || this.properties.readOnly) return
      const items = this.properties.items || []
      const min = Number(this.properties.min)
      const max = Number(this.properties.max)
      const enabled = items
        .map((item: { value?: string | number; disabled?: boolean }, itemIndex: number) => ({ item, itemIndex }))
        .filter(({ item, itemIndex }) => {
          if (!item || item.disabled) return false
          const numeric = Number(item.value ?? itemIndex)
          if (Number.isFinite(min) && numeric < min) return false
          if (Number.isFinite(max) && numeric > max) return false
          return true
        })
      const index = Number(event?.currentTarget?.dataset?.index)
      const place = enabled.findIndex(({ itemIndex }) => itemIndex === index)
      if (place < 0) return
      const horizontal = this.properties.orientation !== 'vertical'
      let next = place
      if (key === 'Home') next = 0
      else if (key === 'End') next = enabled.length - 1
      else {
        const delta = horizontal
          ? key === 'ArrowRight'
            ? 1
            : key === 'ArrowLeft'
              ? -1
              : 0
          : key === 'ArrowDown'
            ? 1
            : key === 'ArrowUp'
              ? -1
              : 0
        if (!delta) return
        next = place + delta
        if (next < 0 || next >= enabled.length) return
      }
      if (next === place) return
      this.onStepTap({ currentTarget: { dataset: { index: enabled[next]?.itemIndex } } })
    },
    onDecrementKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onDecrementTap()
    },
    onIncrementKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onIncrementTap()
    },
    onStepTap(event: { currentTarget?: { dataset?: { index?: number | string } } }) {
      const self = this as WeappStepperInternal
      if (this.properties.disabled || this.properties.readOnly) return
      const index = Number(event?.currentTarget?.dataset?.index)
      const item = (this.properties.items || [])[index] as { value?: string | number; disabled?: boolean } | undefined
      if (!item || item.disabled) return
      const step = String(item.value ?? index)
      const numeric = Number(step)
      const min = Number(this.properties.min)
      const max = Number(this.properties.max)
      if (Number.isFinite(min) && numeric < min) return
      if (Number.isFinite(max) && numeric > max) return
      if (this.properties.value != null) {
        this.triggerEvent('change', { value: Number(step) })
        return
      }
      self.data.api.setValue?.(step)
      const rows = this.rowsFor(step)
      this.setData({ current: step, rows, stepStatus: this.stepText(rows) })
      this.triggerEvent('change', { value: Number(step) })
    },
    onDecrementTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappStepperInternal
      if (this.properties.value != null) {
        const step = Number(this.properties.step) || 1
        const min = Number(this.properties.min)
        const next = Math.max(Number(this.data.current) - step, Number.isFinite(min) ? min : Number(this.data.current) - step)
        this.triggerEvent('change', { value: next })
        return
      }
      const next = commitControl(self, 'select')
      if (next.disabled) return
      self.data.api.decrement?.()
    },
    onIncrementTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappStepperInternal
      if (this.properties.value != null) {
        const step = Number(this.properties.step) || 1
        const max = Number(this.properties.max)
        const next = Math.min(Number(this.data.current) + step, Number.isFinite(max) ? max : Number(this.data.current) + step)
        this.triggerEvent('change', { value: next })
        return
      }
      const next = commitControl(self, 'select')
      if (next.disabled) return
      self.data.api.increment?.()
    },
    onInput(e: StepperInputEvent) {
      if (this.properties.disabled || this.properties.readOnly) return
      const self = this as WeappStepperInternal
      const value = String(e.detail?.value ?? '')
      if (this.properties.value != null) {
        this.triggerEvent('change', { value: Number(value) })
        return
      }
      const rows = this.rowsFor(value)
      this.setData({ current: value, rows, stepStatus: this.stepText(rows) })
      self.data.api.setValue?.(value)
    },
  },
})
