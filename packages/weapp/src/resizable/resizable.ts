import { emitTimEvent } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    leftPercent: {
      type: null,
      value: null,
    },
    minPercent: {
      type: Number,
      value: 20,
    },
    maxPercent: {
      type: Number,
      value: 80,
    },
    disabled: {
      type: Boolean,
      value: false,
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

  data: {
    size: 50,
  },

  lifetimes: {
    attached() {
      this.applyLeft()
    },
  },

  observers: {
    leftPercent() {
      this.applyLeft()
    },
    minPercent() {
      this.applyCurrent()
    },
    maxPercent() {
      this.applyCurrent()
    },
  },

  methods: {
    clamp(value: number) {
      const min = Number(this.properties.minPercent)
      const max = Number(this.properties.maxPercent)
      return Math.max(min, Math.min(max, value))
    },

    applyLeft() {
      const raw = this.properties.leftPercent
      if (raw == null || raw === '') return
      const next = this.clamp(Number(raw))
      if (!Number.isFinite(next) || next === this.data.size) return
      this.setData({ size: next })
    },

    applyCurrent() {
      this.setData({ size: this.clamp(Number(this.data.size)) })
    },

    onSliderChange(e: WechatMiniprogram.SliderChange) {
      if (this.properties.disabled) return
      const next = this.clamp(Number(e.detail.value))
      const raw = this.properties.leftPercent
      if (raw != null) {
        emitTimEvent(this, 'change', 'change', this.properties.id || 'resizable', {
          leftPercent: next,
          rightPercent: 100 - next,
        })
        this.triggerEvent('update:leftPercent', next)
        return
      }
      this.setData({ size: next })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'resizable', {
        leftPercent: next,
        rightPercent: 100 - next,
      })
      this.triggerEvent('update:leftPercent', next)
    },
  },
})
