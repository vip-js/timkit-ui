import { cardVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
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
    extClass: function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's cardVariants for consistent styling
      const { baseClass } = cardVariants({
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass })
    },
  },
})
