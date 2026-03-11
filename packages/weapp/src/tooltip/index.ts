import { resolveClasses, tooltipContentVariants } from '../utils'
import { setupTooltipMachine } from './use-tooltip'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappTooltipApi = {
  open?: () => void
  close?: () => void
}

type WeappService = {
  setContext: (context: { disabled?: boolean; openDelay?: number; closeDelay?: number }) => void
}

type WeappTooltipInternal = WechatMiniprogram.Component.InstanceMethods<WeappTooltipApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  _connect?: (state: object, send: (event: MachineEvent) => void) => WeappTooltipApi
  data: {
    api: WeappTooltipApi
  }
  properties: {
    disabled: boolean
    openDelay: number
    closeDelay: number
    id: string
    extClass: string
  }
}

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    disabled: { type: Boolean, value: false },
    openDelay: { type: Number, value: 700 },
    closeDelay: { type: Number, value: 300 },
    id: { type: String, value: 'tooltip' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappTooltipApi,
    contentClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappTooltipInternal
      const { controller, connect } = setupTooltipMachine(self)

      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as (event: MachineEvent) => void
      self._connect = connect
    },
    detached() {
      const self = this as WeappTooltipInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappTooltipInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappTooltipApi

      const contentClass = resolveClasses(tooltipContentVariants())

      this.setData({ api, contentClass })
    },
  },

  methods: {
    onTriggerLongPress() {
      const self = this as WeappTooltipInternal
      self.data.api.open?.()
    },
    onTriggerTouchEnd() {
      const self = this as WeappTooltipInternal
      self.data.api.close?.()
    },
  },
})
