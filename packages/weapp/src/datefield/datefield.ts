import { emitTimEvent } from '../utils'
import { setupDateFieldMachine } from './use-datefield'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappDateFieldApi = {
  valueAsString?: string[]
  setValue?: (value: string[]) => void
}

type WeappService = {
  setContext: (context: {
    value?: string[]
    min?: string[]
    max?: string[]
    disabled?: boolean
  }) => void
}

type DateFieldChangeDetails = {
  valueAsString?: string[]
}

type PickerChangeEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappDateFieldInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    data: {
      api: WeappDateFieldApi
      pickerValue: string
    }
    properties: {
      value: string[]
      min: string
      max: string
      disabled: boolean
      placeholder: string
      format: string
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
    value: { type: Array, value: [] },
    min: { type: String, value: '' },
    max: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    placeholder: { type: String, value: '请选择日期' },
    format: { type: String, value: 'yyyy-MM-dd' },
    id: { type: String, value: 'datefield' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappDateFieldApi,
    className: '',
    pickerValue: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappDateFieldInternal
      const { service, cleanup, send } = setupDateFieldMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
        min: this.properties.min ? [this.properties.min] : undefined,
        max: this.properties.max ? [this.properties.max] : undefined,
        disabled: this.properties.disabled,
        onValueChange: (details: DateFieldChangeDetails) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'datefield', {
            value: details.valueAsString || [],
          })
          this.updatePickerValue(details.valueAsString?.[0])
        },
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: MachineEvent) => void
    },
    detached() {
      const self = this as WeappDateFieldInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappDateFieldInternal
      if (!state || !self._send) return
      const { connect } = setupDateFieldMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappDateFieldApi
      this.setData({
        api,
        className: this.properties.extClass,
        pickerValue: api.valueAsString?.[0] || '',
      })
    },
  },

  methods: {
    updatePickerValue(value?: string) {
      this.setData({ pickerValue: value || '' })
    },
    onPickerChange(e: PickerChangeEvent) {
      const self = this as WeappDateFieldInternal
      const value = e.detail.value
      self.data.api.setValue?.([value])
    },
  },
})
