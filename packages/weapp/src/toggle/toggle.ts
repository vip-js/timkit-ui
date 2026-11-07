import { createControl, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl } from '../utils/control'
import { setupToggleMachine } from './use-toggle'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappToggleApi = {
  pressed?: boolean
  setPressed?: (pressed: boolean) => void
  buttonProps?: {
    onClick?: () => void
  }
}

type WeappService = {
  setContext: (context: { pressed?: boolean; disabled?: boolean }) => void
}

type WeappToggleInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    _connect?: (state: object, send: (event: MachineEvent) => void) => WeappToggleApi
    data: {
      api: WeappToggleApi
      on: boolean
      control?: ControlState
    }
    properties: {
      pressed: boolean | null
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
    pressed: { type: null, value: null },
    defaultPressed: { type: null, value: null },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'toggle' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappToggleApi,
    className: '',
    on: false,
    pressStatus: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappToggleInternal
      const { service, start, send, connect } = setupToggleMachine(this, {
        id: this.properties.id,
        pressed: this.properties.pressed == null ? this.properties.defaultPressed === true : this.properties.pressed,
        disabled: this.properties.disabled,
        onPressedChange: (details: boolean | { pressed?: boolean }) => {
          const pressed = typeof details === 'boolean' ? details : Boolean(details?.pressed)
          emitTimEvent(this, 'change', 'change', this.properties.id || 'toggle', {
            pressed,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
    },
    detached() {
      const self = this as WeappToggleInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappToggleInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      this.setData({
        api,
        on: Boolean(api.pressed),
        pressStatus: api.pressed ? 'Pressed' : '',
        className: this.properties.extClass,
      })
    },

    pressed: function (val: boolean) {
      const self = this as WeappToggleInternal
      if (val == null || !self.data.api.setPressed || Boolean(val) === self.data.on) return
      self.data.api.setPressed(Boolean(val))
    },
  },

  methods: {
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTap()
    },
    onTap() {
      const self = this as WeappToggleInternal
      const next = commitControl(self, 'select', self.data.on ? 'false' : 'true')
      if (next.disabled) return
      const pressed = !self.data.on
      if (this.properties.pressed != null) {
        emitTimEvent(this, 'change', 'change', this.properties.id || 'toggle', { pressed })
        return
      }
      self.data.api.setPressed?.(pressed)
    },
  },
})
