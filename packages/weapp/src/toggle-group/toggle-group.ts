import { setupToggleGroupMachine } from './use-toggle-group'

type WeappToggleGroupApi = {
  value?: string[]
  setValue?: (value: string[]) => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type ToggleGroupTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
    }
  }
}

type WeappToggleGroupInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappToggleGroupApi
  }
  properties: {
    value: string[]
    multiple: boolean
    disabled: boolean
    loop: boolean
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
    value: { type: Array, value: [] },
    multiple: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loop: { type: Boolean, value: true },
    id: { type: String, value: 'toggle-group' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappToggleGroupApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappToggleGroupInternal
      const { service, cleanup, send } = setupToggleGroupMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
        multiple: this.properties.multiple,
        disabled: this.properties.disabled,
        loop: this.properties.loop,
        onValueChange: (details) => {
          this.triggerEvent('change', details)
        }
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: object) => void
    },
    detached() {
      const self = this as WeappToggleGroupInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappToggleGroupInternal
      if (!state || !self._send) return
      const { connect } = setupToggleGroupMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappToggleGroupApi
      this.setData({ api, className: this.properties.extClass })
    },

    'value': function (val) {
      const self = this as WeappToggleGroupInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
    },
  },

  methods: {
    onItemTap(e: ToggleGroupTapEvent) {
      const self = this as WeappToggleGroupInternal
      const value = e.currentTarget.dataset.value
      if (value && self.data.api.setValue) {
        const currentValue = self.data.api.value || []
        if (this.properties.multiple) {
          const newValue = currentValue.includes(value)
            ? currentValue.filter((v) => v !== value)
            : [...currentValue, value]
          self.data.api.setValue(newValue)
        } else {
          self.data.api.setValue([value])
        }
      }
    },
  },
})
