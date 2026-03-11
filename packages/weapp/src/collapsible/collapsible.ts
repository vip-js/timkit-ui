import { emitTimEvent } from '../utils'
import { setupCollapsibleMachine } from './use-collapsible'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappCollapsibleApi = {
  open?: () => void
  close?: () => void
  triggerProps?: {
    onClick?: () => void
  }
}

type WeappService = {
  setContext: (context: { open?: boolean; disabled?: boolean }) => void
}

type WeappCollapsibleInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    data: {
      api: WeappCollapsibleApi
    }
    properties: {
      open: boolean
      disabled: boolean
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
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'collapsible' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappCollapsibleApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappCollapsibleInternal
      const { service, cleanup, send } = setupCollapsibleMachine(this, {
        id: this.properties.id,
        open: this.properties.open,
        disabled: this.properties.disabled,
        onOpenChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'collapsible', {
            open: details.open,
          })
        },
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappCollapsibleInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappCollapsibleInternal
      if (!state || !self._send) return
      const { connect } = setupCollapsibleMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappCollapsibleApi
      this.setData({ api, className: this.properties.extClass })
    },

    open: function (val) {
      const self = this as WeappCollapsibleInternal
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
      const self = this as WeappCollapsibleInternal
      self.data.api.triggerProps?.onClick?.()
    },
  },
})
