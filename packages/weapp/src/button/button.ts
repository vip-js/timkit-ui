import { buttonVariants } from '../utils'

type TapEvent = WechatMiniprogram.BaseEvent<{
  value?: string
}>

Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    variant: { type: String, value: 'default' }, // renamed from 'type' to match core API
    size: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    plain: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
    },
  },

  observers: {
    'variant, size, disabled, loading, plain, extClass': function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's buttonVariants for consistent styling
      const { baseClass } = buttonVariants({
        variant: this.properties.variant || 'default',
        size: this.properties.size === 'icon' ? 'icon' : this.properties.size || 'default',
        className: this.properties.extClass
      })

      const classes = [baseClass]

      if (this.properties.disabled) {
        classes.push('button-disabled')
      }
      if (this.properties.loading) {
        classes.push('button-loading')
      }
      if (this.properties.plain) {
        classes.push('button-plain')
      }

      this.setData({ className: classes.join(' ') })
    },

    onTap(e: TapEvent) {
      if (!this.properties.disabled && !this.properties.loading) {
        this.triggerEvent('tap', e.detail)
      }
    },
  },
})
