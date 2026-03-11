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
      const { baseClass } = badgeVariants({
        variant: this.properties.variant || 'default',
        className: this.properties.extClass,
      })

      const classes = [baseClass]

      if (this.properties.size && this.properties.size !== 'default') {
        classes.push(`badge-${this.properties.size}`)
      }

      this.setData({ className: classes.join(' ') })
    },
  },
})
