import { setupRadioGroupMachine } from './use-radio-group'
import { resolveClasses, radioGroupVariants } from '../utils'

type WeappRadioGroupApi = Record<string, object>

type WeappService = {
  setContext: (context: Record<string, object>) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappRadioGroupInternal = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappRadioGroupApi
  data: {
    api: WeappRadioGroupApi
  }
  properties: {
    value: string
    name: string
    disabled: boolean
    orientation: string
    id: string
    extClass: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  properties: {
    value: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    orientation: {
      type: String,
      value: 'vertical',
    },
    id: {
      type: String,
      value: 'radio-group',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as WeappRadioGroupApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappRadioGroupInternal
      const { controller, connect } = setupRadioGroupMachine(this)
      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as WeappRadioGroupInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappRadioGroupInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappRadioGroupApi

      const { baseClass } = resolveClasses(radioGroupVariants(), self.properties.extClass)

      this.setData({ api, className: baseClass })
    },

    'value': function (val) {
      const self = this as WeappRadioGroupInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
    },

    'disabled': function (val) {
      const self = this as WeappRadioGroupInternal
      if (self._service) {
        self._service.setContext({ disabled: val })
      }
    },
  },
})
