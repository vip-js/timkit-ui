import { setupSwitchMachine } from './use-switch'
import { switchThumbVariants, switchVariants } from '../utils'

type WeappSwitchApi = {
  checked?: boolean
  rootProps?: {
    onClick?: (event: object) => void
  }
}

type WeappService = {
  send: (event: object) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappSwitchInternal = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappSwitchApi
  data: {
    api: WeappSwitchApi
  }
  properties: {
    checked: boolean
    defaultChecked: boolean
    disabled: boolean
    required: boolean
    readOnly: boolean
    name: string
    form: string
    value: string
    label: string
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
    checked: { type: Boolean, value: false },
    defaultChecked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    name: { type: String, value: '' },
    form: { type: String, value: '' },
    value: { type: String, value: 'on' },
    label: { type: String, value: '' },
    id: { type: String, value: 'switch' },
  },

  data: {
    api: {} as WeappSwitchApi,
    className: '',
    thumbClassName: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappSwitchInternal
      const { controller, connect } = setupSwitchMachine(this)
      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect

      this.setData({
        className: switchVariants({ className: this.properties.extClass }),
        thumbClassName: switchThumbVariants(),
      })
    },
    detached() {
      const self = this as WeappSwitchInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappSwitchInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappSwitchApi
      this.setData({ api })
    },
    'checked': function (val) {
      const self = this as WeappSwitchInternal
      if (self._service && val !== self.data.api.checked) {
        self._send?.({ type: 'CHECKED.SET', checked: val })
      }
    },
    'disabled': function (val) {
      const self = this as WeappSwitchInternal
      self._service?.send({ type: 'DISABLED.SET', disabled: val })
    },
  },

  methods: {
    onTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappSwitchInternal
      self.data.api.rootProps?.onClick?.(e)
    },
  },
})
