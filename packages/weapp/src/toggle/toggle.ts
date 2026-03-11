import { emitTimEvent } from '../utils'
import { setupToggleMachine } from './use-toggle'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappToggleApi = {
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
    data: {
      api: WeappToggleApi
    }
    properties: {
      pressed: boolean
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
    pressed: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'toggle' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappToggleApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappToggleInternal
      const { service, cleanup, send } = setupToggleMachine(this, {
        id: this.properties.id,
        pressed: this.properties.pressed,
        disabled: this.properties.disabled,
        onPressedChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'toggle', {
            pressed: details.pressed,
          })
        },
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappToggleInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappToggleInternal
      if (!state || !self._send) return
      const { connect } = setupToggleMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappToggleApi
      this.setData({ api, className: this.properties.extClass })
    },

    pressed: function (val) {
      const self = this as WeappToggleInternal
      if (self._service) {
        self._service.setContext({ pressed: val })
      }
    },
  },

  methods: {
    onTap() {
      const self = this as WeappToggleInternal
      self.data.api.buttonProps?.onClick?.()
    },
  },
})
