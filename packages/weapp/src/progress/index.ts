// @ts-nocheck
import { setupProgressMachine, connectProgressMachine, type WeappProgressApi, type WeappProgressService } from './use-progress'
import { resolveClasses } from '../utils'
import { progressRootVariants, progressIndicatorVariants } from '../utils'

type WeappProgressInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappProgressService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappProgressApi
  }
  properties: {
    value: number
    max: number
    min: number
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
    value: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 100,
    },
    min: {
      type: Number,
      value: 0,
    },
    id: {
      type: String,
      value: 'progress',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as WeappProgressApi,
    rootClass: '',
    indicatorClass: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappProgressInternal
      const controller = setupProgressMachine(this, {
        id: this.properties.id,
        value: this.properties.value,
        max: this.properties.max,
        min: this.properties.min,
      })

      self._service = controller.service as WeappProgressService
      self._cleanup = controller.start()
      self._send = controller.send as (event: object) => void
    },
    detached() {
      const self = this as WeappProgressInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappProgressInternal
      if (!state || !self._send) return
      const api = connectProgressMachine(state, self._send) as WeappProgressApi

      const { baseClass: rootClass } = resolveClasses(progressRootVariants(), self.properties.extClass)
      const { baseClass: indicatorClass } = resolveClasses(progressIndicatorVariants())

      this.setData({ api, rootClass, indicatorClass })
    },

    'value': function (val) {
      const self = this as WeappProgressInternal
      if (self._service) {
        self._service.setContext({ value: val })
      }
    },

    'max': function (val) {
      const self = this as WeappProgressInternal
      if (self._service) {
        self._service.setContext({ max: val })
      }
    },

    'min': function (val) {
      const self = this as WeappProgressInternal
      if (self._service) {
        self._service.setContext({ min: val })
      }
    },
  },
})
