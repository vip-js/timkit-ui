import { setupSliderMachine } from './use-slider'
import { resolveClasses } from '../utils'
import { sliderRootVariants, sliderTrackVariants, sliderRangeVariants, sliderThumbVariants } from '../utils'

type WeappSliderApi = Record<string, object>

type WeappService = {
  setContext: (context: Record<string, object>) => void
}
type MachineEvent = string | { type: string; [key: string]: object }
type MachineSend = (event: MachineEvent) => void

type WeappSliderInternal = WechatMiniprogram.Component.InstanceMethods<{}, {}, {}> & {
  _service?: WeappService
  _cleanup?: () => void
  _send?: (event: object) => void
  _connect?: (state: object, send: MachineSend) => WeappSliderApi
  data: {
    api: WeappSliderApi
  }
  properties: {
    value: number[]
    min: number
    max: number
    step: number
    orientation: string
    disabled: boolean
    name: string
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
    value: { type: Array, value: [0] },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    orientation: { type: String, value: 'horizontal' },
    disabled: { type: Boolean, value: false },
    name: { type: String, value: '' },
    id: { type: String, value: 'slider' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappSliderApi,
    rootClass: '',
    trackClass: '',
    rangeClass: '',
    thumbClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappSliderInternal
      const { controller, connect } = setupSliderMachine(this)
      self._service = controller.service as WeappService
      self._cleanup = controller.start()
      self._send = controller.send as MachineSend
      self._connect = connect
    },
    detached() {
      const self = this as WeappSliderInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappSliderInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappSliderApi

      const { baseClass: rootClass } = resolveClasses(sliderRootVariants(), self.properties.extClass)
      const { baseClass: trackClass } = resolveClasses(sliderTrackVariants())
      const { baseClass: rangeClass } = resolveClasses(sliderRangeVariants())
      const { baseClass: thumbClass } = resolveClasses(sliderThumbVariants())

      this.setData({ api, rootClass, trackClass, rangeClass, thumbClass })
    },

    'value': function (val) {
      const self = this as WeappSliderInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
    },

    'disabled': function (val) {
      const self = this as WeappSliderInternal
      if (self._service) {
        self._service.setContext({ disabled: val })
      }
    },
  },
})
