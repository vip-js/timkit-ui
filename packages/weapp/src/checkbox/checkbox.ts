import { createControl, reduceControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { checkboxVariants, emitTimEvent } from '../utils'
import { publishMachine } from '../utils/machine'
import { setupCheckboxMachine } from './use-checkbox'

type CheckboxChecked = boolean | 'indeterminate'

type WeappCheckboxApi = {
  checked?: CheckboxChecked
  indeterminate?: boolean
  disabled?: boolean
  toggleChecked?: () => void
  rootProps?: {
    onClick?: (event: object) => void
  }
}

type WeappService = {
  send: (event: object) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappCheckboxInternal = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappCheckboxApi
  data: {
    api: WeappCheckboxApi
    control?: ControlState
  }
  properties: {
    checked: CheckboxChecked
    defaultChecked: CheckboxChecked
    disabled: boolean
    required: boolean
    readOnly: boolean
    name: string
    form: string
    value: string
    id: string
    extClass: string
    invalid: boolean | string | null
    describedBy: string | null
    'aria-label': string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    checked: { type: null, value: null }, // boolean | 'indeterminate'
    defaultChecked: { type: null, value: false },
    disabled: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    name: { type: String, value: '' },
    form: { type: String, value: '' },
    value: { type: String, value: 'on' },
    id: { type: String, value: 'checkbox' },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    'aria-label': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappCheckboxApi,
    className: '',
    stateName: 'unchecked',
    checkStatus: '',
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappCheckboxInternal
      const { controller, connect } = setupCheckboxMachine(this)
      self._service = controller.service as WeappService
      self._send = controller.send as MachineSend
      self._connect = connect
      self._cleanup = controller.start()

      this.setData({
        className: checkboxVariants({ className: this.properties.extClass }),
        ariaLabel: String(this.properties['aria-label'] || ''),
      })
      publishMachine(this)
    },
    detached() {
      const self = this as WeappCheckboxInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappCheckboxInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappCheckboxApi
      const stateName = api.indeterminate ? 'indeterminate' : api.checked ? 'checked' : 'unchecked'
      const { baseClass } = checkboxVariants({ className: self.properties.extClass })
      this.setData({ api, className: baseClass, stateName, checkStatus: this.checkText(stateName) })
    },

    checked: function (val) {
      const self = this as WeappCheckboxInternal
      if (val == null || !self._service || val === self.data.api.checked) return
      self._send?.({ type: 'CHECKED.SET', checked: val })
    },
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    disabled: function (val) {
      const self = this as WeappCheckboxInternal
      self._service?.send({ type: 'DISABLED.SET', disabled: val })
    },
  },

  methods: {
    checkText(stateName: string) {
      if (stateName === 'checked') return 'Checked'
      if (stateName === 'indeterminate') return 'Mixed'
      return ''
    },
    onTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappCheckboxInternal
      const next = reduceControl(
        { ...(self.data.control ?? createControl()), disabled: !!self.properties.disabled },
        'select',
        'on'
      )
      this.setData({ control: next })
      if (next.disabled || self.properties.readOnly || self.data.api.disabled) return
      if (self.properties.checked != null) {
        const turningOn = self.data.stateName !== 'checked'
        this.triggerEvent('input', { value: turningOn })
        emitTimEvent(this, 'change', 'change', this.properties.id || 'checkbox', {
          checked: turningOn,
        })
        return
      }
      self.data.api.toggleChecked?.()
      self.data.api.rootProps?.onClick?.(e)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const next = reduceWidgetKey(
        'checkbox',
        {
          open: false,
          index: 0,
          count: 0,
          checked: this.data.stateName === 'checked',
          value: 0,
          min: 0,
          max: 0,
          step: 1,
        },
        key
      )
      if (!next.handled) return
      this.onTap()
    },
  },
})
