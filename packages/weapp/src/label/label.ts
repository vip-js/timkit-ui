import { labelVariants } from '../utils'

type TapEvent = WechatMiniprogram.BaseEvent<{
  value?: string
}>

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    htmlFor: { type: String, value: '' },
    for: { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
    target: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
      this.syncTarget()
    },
  },

  observers: {
    extClass: function () {
      this.updateClassName()
    },
    'htmlFor, for': function () {
      this.syncTarget()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's labelVariants for consistent styling
      const { baseClass } = labelVariants({
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass })
    },

    syncTarget() {
      this.setData({ target: this.properties.htmlFor || this.properties.for || '' })
    },

    onTap(e: TapEvent) {
      this.triggerEvent('tap', e.detail)
    },
  },
})
