import { setupStepperMachine } from '../stepper/use-stepper'
import { emitTimEvent } from '../utils'

type WeappNumberFieldApi = {
  decrement?: () => void
  increment?: () => void
  setValue?: (value: string | number) => void
  value?: string
  isAtMin?: boolean
  isAtMax?: boolean
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type NumberFieldEvent = WechatMiniprogram.CustomEvent<{
  value: string
}>

type WeappNumberFieldInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    data: {
      api: WeappNumberFieldApi
    }
    properties: {
      value: string
      min: number
      max: number
      step: number
      disabled: boolean
      readOnly: boolean
      allowMouseWheel: boolean
      clampValueOnBlur: boolean
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
    value: { type: String, value: '0' },
    min: { type: Number, value: Number.MIN_SAFE_INTEGER },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    allowMouseWheel: { type: Boolean, value: false },
    clampValueOnBlur: { type: Boolean, value: true },
    id: { type: String, value: 'number-field' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappNumberFieldApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappNumberFieldInternal
      const { service, cleanup, send } = setupStepperMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
        min: this.properties.min,
        max: this.properties.max,
        step: this.properties.step,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        allowMouseWheel: this.properties.allowMouseWheel,
        clampValueOnBlur: this.properties.clampValueOnBlur,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'number-field', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send as (event: object) => void
    },
    detached() {
      const self = this as WeappNumberFieldInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappNumberFieldInternal
      if (!state || !self._send) return
      const { connect } = setupStepperMachine(this, { id: this.properties.id })
      const api = connect(state, self._send) as WeappNumberFieldApi
      this.setData({ api, className: this.properties.extClass })
    },

    value: function (val) {
      const self = this as WeappNumberFieldInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
    },
  },

  methods: {
    onDecrementTap() {
      const self = this as WeappNumberFieldInternal
      self.data.api.decrement?.()
    },
    onIncrementTap() {
      const self = this as WeappNumberFieldInternal
      self.data.api.increment?.()
    },
    onInput(e: NumberFieldEvent) {
      const self = this as WeappNumberFieldInternal
      const value = e.detail.value
      self.data.api.setValue?.(value)
    },
  },
})
