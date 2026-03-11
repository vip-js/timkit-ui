import { emitTimEvent } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    leftPercent: {
      type: Number,
      value: 50,
    },
    minPercent: {
      type: Number,
      value: 20,
    },
    maxPercent: {
      type: Number,
      value: 80,
    },
    id: {
      type: String,
      value: 'resizable',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  methods: {
    onSliderChange(e: WechatMiniprogram.SliderChange) {
      const raw = Number(e.detail.value || this.properties.leftPercent)
      const next = Math.max(this.properties.minPercent, Math.min(this.properties.maxPercent, raw))
      emitTimEvent(this, 'change', 'change', this.properties.id || 'resizable', {
        leftPercent: next,
        rightPercent: 100 - next,
      })
      this.triggerEvent('update:leftPercent', next)
    },
  },
})
