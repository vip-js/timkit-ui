Component({
  options: {
    styleIsolation: 'apply-shared',
  },

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
    extClass: {
      type: String,
      value: '',
    },
  },

  methods: {
    onSliderChange(e: WechatMiniprogram.SliderChange) {
      const raw = Number(e.detail.value || this.properties.leftPercent)
      const next = Math.max(this.properties.minPercent, Math.min(this.properties.maxPercent, raw))
      this.triggerEvent('change', { leftPercent: next, rightPercent: 100 - next })
      this.triggerEvent('update:leftPercent', next)
    },
  },
})
