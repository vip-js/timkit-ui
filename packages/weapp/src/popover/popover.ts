import { setupPopoverMachine } from './use-popover'

type WeappPopoverApi = {
  triggerProps?: { onClick?: () => void }
  open?: () => void
  close?: () => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappPopoverInternal = WechatMiniprogram.Component.InstanceMethods<WeappPopoverApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappPopoverApi
  data: {
    api: WeappPopoverApi
  }
  properties: {
    open: boolean
    modal: boolean
    portalled: boolean
    closeOnInteractOutside: boolean
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
    open: { type: Boolean, value: false },
    modal: { type: Boolean, value: false },
    portalled: { type: Boolean, value: true },
    closeOnInteractOutside: { type: Boolean, value: true },
    id: { type: String, value: 'popover' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappPopoverApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappPopoverInternal
      const { controller, connect } = setupPopoverMachine(self)

      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as WeappPopoverInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappPopoverInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappPopoverApi
      this.setData({ api, className: this.properties.extClass })
    },

    open: function (val) {
      const self = this as WeappPopoverInternal
      if (self._service) {
        if (val) {
          self.data.api.open?.()
        } else {
          self.data.api.close?.()
        }
      }
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappPopoverInternal
      self.data.api.triggerProps?.onClick?.()
    },
    onBackdropTap() {
      const self = this as WeappPopoverInternal
      self.data.api.close?.()
    },
    onCloseTap() {
      const self = this as WeappPopoverInternal
      self.data.api.close?.()
    },
  },
})
