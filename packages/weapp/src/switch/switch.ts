import { createControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { emitTimEvent, resolveClasses, switchVariants } from '../utils'
import { commitControl } from '../utils/control'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    checked: { type: null, value: null },
    defaultChecked: { type: null, value: null },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    color: { type: String, value: '#1aad19' },
    name: { type: String, value: '' },
    id: { type: String, value: 'switch' },
    'aria-label': { type: String, value: '' },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
    checked: false,
    checkStatus: '',
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const passed = this.properties.checked
      const source = passed == null ? this.properties.defaultChecked : passed
      this.setData({
        checked: source === true,
        checkStatus: source === true ? 'On' : '',
        ariaLabel: String(this.properties['aria-label'] || ''),
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
    checked: function (next: unknown) {
      if (next == null) return
      const checked = next === true
      if (checked === Boolean(this.data.checked)) return
      this.setData({ checked, checkStatus: checked ? 'On' : '' })
    },
  },

  methods: {
    updateClassName() {
      const className = resolveClasses(switchVariants({ className: this.properties.extClass }))
      this.setData({ className })
    },

    onSwitchChange(e: WechatMiniprogram.CustomEvent) {
      if (this.properties.readOnly) return
      const checked = !!e.detail.value
      const next = commitControl(this, 'select', checked ? 'true' : 'false')
      if (next.disabled) return
      if (this.properties.checked == null) this.setData({ checked, checkStatus: checked ? 'On' : '' })
      this.triggerEvent('input', { value: checked })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'switch', {
        checked,
      })
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      if (this.properties.readOnly) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'switch',
        {
          open: false,
          index: 0,
          count: 0,
          checked: this.data.checked === true,
          value: 0,
          min: 0,
          max: 0,
          step: 1,
        },
        key
      )
      if (!next.handled) return
      const committed = commitControl(this, 'select', next.checked ? 'true' : 'false')
      if (committed.disabled) return
      if (this.properties.checked == null) this.setData({ checked: next.checked, checkStatus: next.checked ? 'On' : '' })
      this.triggerEvent('input', { value: next.checked })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'switch', {
        checked: next.checked,
      })
    },
  },
})
