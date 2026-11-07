import { createControl, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'
import { setupCollapsibleMachine } from './use-collapsible'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappCollapsibleApi = {
  open?: boolean
  setOpen?: (open: boolean) => void
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
    _connect?: (state: object, send: (event: MachineEvent) => void) => WeappCollapsibleApi
    data: {
      api: WeappCollapsibleApi
      opened: boolean
      control?: ControlState
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
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'collapsible' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappCollapsibleApi,
    className: '',
    opened: false,
    openStatus: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappCollapsibleInternal
      const passed = this.properties.open
      const { service, start, send, connect } = setupCollapsibleMachine(this, {
        id: this.properties.id,
        open: passed == null ? this.properties.defaultOpen : passed,
        disabled: this.properties.disabled,
        onOpenChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'collapsible', {
            open: details.open,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
    },
    detached() {
      const self = this as WeappCollapsibleInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappCollapsibleInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      this.setData({
        api,
        opened: Boolean(api.open),
        openStatus: api.open ? 'Opened' : '',
        className: this.properties.extClass,
      })
    },

    open: function (val: boolean) {
      const self = this as WeappCollapsibleInternal
      if (val == null || !self.data.api.setOpen || Boolean(val) === self.data.opened) return
      self.data.api.setOpen(Boolean(val))
    },
  },

  methods: {
    onTriggerKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTriggerTap()
    },
    onTriggerTap() {
      const self = this as WeappCollapsibleInternal
      const next = commitControl(self, self.data.opened ? 'close' : 'open')
      if (next.disabled) return
      const open = !self.data.opened
      if (self.properties.open != null) {
        emitTimEvent(this, 'change', 'change', this.properties.id || 'collapsible', { open })
        return
      }
      self.data.api.setOpen?.(open)
    },
  },
})
