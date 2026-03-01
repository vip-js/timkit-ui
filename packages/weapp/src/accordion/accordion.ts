import { setupAccordionMachine } from './use-accordion'

type MachineEvent = string | {
  type: string
  [key: string]: string | number | boolean | string[] | number[] | null | undefined
}

type WeappAccordionApi = {
  setValue?: (value: string[]) => void
}

type WeappService = {
  setContext: (context: {
    value?: string[]
    multiple?: boolean
    collapsible?: boolean
    disabled?: boolean
  }) => void
}

type ItemTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
    }
  }
}

type WeappAccordionInternal = WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: MachineEvent) => void
  data: {
    api: WeappAccordionApi
  }
  properties: {
    value: string[]
    multiple: boolean
    collapsible: boolean
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

  properties: {
    value: { type: Array, value: [] },
    multiple: { type: Boolean, value: false },
    collapsible: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'accordion' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappAccordionApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappAccordionInternal
      const { service, cleanup, send } = setupAccordionMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
        multiple: this.properties.multiple,
        collapsible: this.properties.collapsible,
        disabled: this.properties.disabled,
        onValueChange: (details) => {
          this.triggerEvent('change', details)
        }
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappAccordionInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappAccordionInternal
      if (!state || !self._send) return
      const { connect } = setupAccordionMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappAccordionApi
      this.setData({ api, className: this.properties.extClass })
    },
  },

  methods: {
    onItemTap(e: ItemTapEvent) {
      const self = this as WeappAccordionInternal
      const value = e.currentTarget.dataset.value
      if (value && self.data.api.setValue) {
        self.data.api.setValue([value])
      }
    },
  },
})
