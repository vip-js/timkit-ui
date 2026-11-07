import { badgeVariants } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    variant: { type: String, value: 'default' },
    size: { type: String, value: 'default' },
    ...createWeappBaseProps(),
  },

  data: {
    className: '',
    variantName: 'default',
    toneStatus: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
    },
  },

  observers: {
    'variant, size, extClass': function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's badgeVariants for consistent styling
      const resolved = badgeVariants({
        variant: this.properties.variant || 'default',
        className: this.properties.extClass,
      })
      const baseClass = typeof resolved === 'string' ? resolved : resolved?.baseClass || ''

      const classes = [baseClass]

      if (this.properties.size && this.properties.size !== 'default') {
        classes.push(`badge-${this.properties.size}`)
      }

      const variantName = this.properties.variant || 'default'
      this.setData({
        className: classes.join(' '),
        variantName,
        toneStatus: variantName === 'destructive' ? 'Destructive' : '',
      })
    },
  },
})
