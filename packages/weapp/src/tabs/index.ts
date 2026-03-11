import { setupTabsMachine } from './use-tabs'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type TabsOrientation = 'horizontal' | 'vertical'
type TabsActivationMode = 'manual' | 'automatic'

type WeappTabsApi = Record<string, never>
type MachineSend = (event: MachineEvent) => void

type WeappService = {
  setContext: (context: {
    value?: string
    orientation?: TabsOrientation
    activationMode?: TabsActivationMode
  }) => void
}

type WeappTabsInternal = WechatMiniprogram.Component.InstanceMethods<WeappTabsApi> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  _connect?: (state: object, send: MachineSend) => WeappTabsApi
  data: {
    api: WeappTabsApi
    activeValue?: string
  }
  properties: {
    value: string
    orientation: string
    activationMode: string
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
    value: { type: String, value: '' },
    orientation: { type: String, value: 'horizontal' },
    activationMode: { type: String, value: 'automatic' },
    id: { type: String, value: 'tabs' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappTabsApi,
    className: '',
    activeValue: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappTabsInternal
      const { controller, connect } = setupTabsMachine(self)

      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as WeappTabsInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappTabsInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappTabsApi
      this.setData({ api, className: this.properties.extClass })
    },

    value: function (val) {
      const self = this as WeappTabsInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
      if (typeof val === 'string' && val.length > 0) {
        this.setData({ activeValue: val })
      }
    },
  },

  methods: {
    handleTabClick(event: WechatMiniprogram.TouchEvent) {
      const value = (event.currentTarget?.dataset?.value as string) || ''
      if (!value) return
      this.setData({ activeValue: value })
      this._send?.({ type: 'VALUE.SET', value })
    },
  },
})
