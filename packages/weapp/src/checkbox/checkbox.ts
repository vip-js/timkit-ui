import { setupCheckboxMachine } from './use-checkbox'
import { checkboxVariants } from '../utils'

type CheckboxChecked = boolean | 'indeterminate'

type WeappCheckboxApi = {
  checked?: CheckboxChecked
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
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    checked: { type: null, value: false }, // boolean | 'indeterminate'
    defaultChecked: { type: null, value: false },
    disabled: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    name: { type: String, value: '' },
    form: { type: String, value: '' },
    value: { type: String, value: 'on' },
    id: { type: String, value: 'checkbox' },
  },

  data: {
    api: {} as WeappCheckboxApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappCheckboxInternal
      const { controller, connect } = setupCheckboxMachine(this)
      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect

      this.setData({
        className: checkboxVariants({ className: this.properties.extClass }),
      })
    },
    detached() {
      const self = this as WeappCheckboxInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappCheckboxInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappCheckboxApi

      const { baseClass } = checkboxVariants({ className: self.properties.extClass })
      this.setData({ api, className: baseClass })
    },

    'checked': function (val) {
      const self = this as WeappCheckboxInternal
      if (self._service && val !== self.data.api.checked) {
        self._send?.({ type: 'CHECKED.SET', checked: val })
      }
    },
    'disabled': function (val) {
      const self = this as WeappCheckboxInternal
      self._service?.send({ type: 'DISABLED.SET', disabled: val })
    },
  },

  methods: {
    onTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappCheckboxInternal
      self.data.api.rootProps?.onClick?.(e)
    },
  },
})
