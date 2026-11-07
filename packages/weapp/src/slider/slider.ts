import { createControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { emitTimEvent, resolveClasses, sliderRootVariants } from '../utils'
import { commitControl, controlEventValue } from '../utils/control'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'slider' },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    orientation: { type: String, value: 'horizontal' },
    showValue: { type: Boolean, value: false },
    activeColor: { type: String, value: '#1aad19' },
    backgroundColor: { type: String, value: '#e9e9e9' },
    blockSize: { type: Number, value: 28 },
    blockColor: { type: String, value: '#ffffff' },
    name: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    rootClass: '',
    value: 0,
    ariaLabel: '',
    labelledBy: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      this.setData({
        value: source == null ? 0 : source === '' ? '' : Number(source),
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
      this.updateClassName()
    },
  },

  observers: {
    extClass: function () {
      this.updateClassName()
    },
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
    value: function (next: unknown) {
      if (next == null) return
      if (next === '') {
        if (this.data.value === '') return
        this.setData({ value: '' })
        return
      }
      const value = Number(next)
      if (!Number.isFinite(value) || value === Number(this.data.value)) return
      this.setData({ value })
    },
    min: function () {
      this.clampBounds()
    },
    max: function () {
      this.clampBounds()
    },
  },

  methods: {
    clampBounds() {
      const current = Number(this.data.value)
      if (!Number.isFinite(current)) return
      const min = Number(this.properties.min)
      const max = Number(this.properties.max)
      const low = Number.isFinite(min) ? min : 0
      const high = Number.isFinite(max) ? max : 100
      const next = Math.min(high, Math.max(low, current))
      if (next === current) return
      if (this.properties.value == null) this.setData({ value: next })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'slider', {
        value: [next],
      })
    },
    updateClassName() {
      const rootClass = resolveClasses(sliderRootVariants(), this.properties.extClass)
      this.setData({ rootClass })
    },

    onSliderChange(e: WechatMiniprogram.CustomEvent) {
      const value = Number(e.detail.value ?? 0)
      const next = commitControl(this, 'select', controlEventValue(e))
      if (next.disabled || this.properties.readOnly) return
      if (this.properties.value == null) this.setData({ value })
      emitTimEvent(this, 'change-end', 'change-end', this.properties.id || 'slider', {
        value: [value],
      })
    },

    onKey(event?: { detail?: { key?: string; shiftKey?: boolean }; mark?: { key?: string; shiftKey?: boolean } }) {
      if (this.properties.disabled || this.properties.readOnly) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const shift = Boolean(event?.detail?.shiftKey || event?.mark?.shiftKey)
      if (key === 'PageUp' || key === 'PageDown') {
        const current = Number(this.data.value)
        const min = Number(this.properties.min)
        const max = Number(this.properties.max)
        const step = Number(this.properties.step) || 1
        const base = Number.isFinite(current) ? current : min
        const value = Math.min(max, Math.max(min, base + (key === 'PageUp' ? 10 : -10) * step))
        if (this.properties.value == null) this.setData({ value })
        emitTimEvent(this, 'change', 'change', this.properties.id || 'slider', { value: [value] })
        return
      }
      const vertical = this.properties.orientation === 'vertical'
      const horizontalKey = key === 'ArrowRight' || key === 'ArrowLeft'
      const verticalKey = key === 'ArrowDown' || key === 'ArrowUp'
      if ((vertical && horizontalKey) || (!vertical && verticalKey)) return
      const current = Number(this.data.value)
      const next = reduceWidgetKey(
        'slider',
        {
          open: false,
          index: 0,
          count: 0,
          checked: false,
          value: Number.isFinite(current) ? current : Number(this.properties.min),
          min: Number(this.properties.min),
          max: Number(this.properties.max),
          step: (Number(this.properties.step) || 1) * (shift && (horizontalKey || verticalKey) ? 10 : 1),
        },
        key
      )
      if (!next.handled) return
      if (this.properties.value == null) this.setData({ value: next.value })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'slider', {
        value: [next.value],
      })
    },

    onSliderChanging(e: WechatMiniprogram.CustomEvent) {
      if (this.properties.disabled || this.properties.readOnly) return
      const value = Number(e.detail.value ?? 0)
      if (this.properties.value == null) this.setData({ value })
      this.triggerEvent('changing', { value })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'slider', {
        value: [value],
      })
    },
  },
})
