import { emitTimEvent, resolveClasses, sliderRootVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'slider' },
    value: { type: Number, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    showValue: { type: Boolean, value: false },
    activeColor: { type: String, value: '#1aad19' },
    backgroundColor: { type: String, value: '#e9e9e9' },
    blockSize: { type: Number, value: 28 },
    blockColor: { type: String, value: '#ffffff' },
    name: { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    rootClass: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
    },
  },

  observers: {
    extClass: function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      const rootClass = resolveClasses(sliderRootVariants(), this.properties.extClass)
      this.setData({ rootClass })
    },

    onSliderChange(e: WechatMiniprogram.CustomEvent) {
      emitTimEvent(this, 'change-end', 'change-end', this.properties.id || 'slider', {
        value: [Number(e.detail.value ?? 0)],
      })
    },

    onSliderChanging(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('changing', { value: e.detail.value })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'slider', {
        value: [Number(e.detail.value ?? 0)],
      })
    },
  },
})
