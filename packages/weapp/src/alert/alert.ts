import { alertVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    variant: {
      type: String,
      value: 'default',
    },
    title: {
      type: String,
      value: '',
    },
    description: {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
    variantName: 'default',
    toneStatus: '',
  },
  lifetimes: {
    attached() {
      this.sync()
    },
  },
  observers: {
    'variant, extClass': function () {
      this.sync()
    },
  },
  methods: {
    sync() {
      const variant = this.properties.variant || 'default'
      this.setData({
        variantName: variant,
        toneStatus: variant === 'destructive' ? 'Destructive' : '',
        className: alertVariants({ variant, className: this.properties.extClass }),
      })
    },
  },
})
