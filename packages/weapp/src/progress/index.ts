// @ts-nocheck
import { progressPercent } from '@timui/core'

import { progressIndicatorVariants, progressRootVariants, resolveClasses } from '../utils'
import {
  connectProgressMachine,
  setupProgressMachine,
  type WeappProgressApi,
  type WeappProgressService,
} from './use-progress'

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

  externalClasses: ['ext-class'],

  properties: {
    value: {
      type: null,
      value: null,
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
    'aria-label': {
      type: String,
      value: '',
    },
    'aria-labelledby': {
      type: String,
      value: '',
    },
  },

  data: {
    api: {} as WeappProgressApi,
    rootClass: '',
    indicatorClass: '',
    current: null as number | null,
    percent: 0,
    state: 'indeterminate',
    ariaLabel: '',
    labelledBy: '',
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
      self._send = controller.send as (event: object) => void
      self._cleanup = controller.start()
      this.sync()
      const ariaLabel = String(this.properties['aria-label'] || '')
      const labelledBy = String(this.properties['aria-labelledby'] || '')
      if (this.data.ariaLabel !== ariaLabel || this.data.labelledBy !== labelledBy) {
        this.setData({ ariaLabel, labelledBy })
      }
    },
    detached() {
      const self = this as WeappProgressInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappProgressInternal
      if (!state || !self._send) return
      try {
        const api = connectProgressMachine(state, self._send) as WeappProgressApi
        this.setData({ api })
      } catch {
        // The visible percent comes from sync().
      }
    },

    value: function () {
      this.sync()
    },

    max: function () {
      this.sync()
    },

    min: function () {
      this.sync()
    },

    'aria-label': function (value: string) {
      const ariaLabel = String(value || '')
      if (this.data.ariaLabel === ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby': function (value: string) {
      const labelledBy = String(value || '')
      if (this.data.labelledBy === labelledBy) return
      this.setData({ labelledBy })
    },
  },

  methods: {
    sync() {
      const min = Number(this.properties.min ?? 0)
      const max = Number(this.properties.max ?? 100)
      const raw = this.properties.value
      const indeterminate = raw === null || raw === undefined || raw === ''
      const current = indeterminate ? null : Number(raw)
      this.setData({
        current,
        percent: indeterminate ? 0 : (progressPercent(current, min, max) ?? 0),
        valueText: indeterminate ? '' : `${Math.round(progressPercent(current, min, max) ?? 0)}%`,
        state: indeterminate ? 'indeterminate' : 'loading',
        rootClass: resolveClasses(progressRootVariants(), this.properties.extClass).baseClass,
        indicatorClass: resolveClasses(progressIndicatorVariants()).baseClass,
      })
    },
  },
})
