import { separatorVariants } from '../utils'

type SeparatorOrientation = 'horizontal' | 'vertical'

function toOrientation(value: string): SeparatorOrientation {
  return value === 'vertical' ? 'vertical' : 'horizontal'
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],
  properties: {
    orientation: {
      type: String,
      value: 'horizontal',
    },
    decorative: {
      type: Boolean,
      value: true,
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
    role: 'none',
    ariaOrientation: '',
  },
  lifetimes: {
    attached() {
      this.sync()
    },
  },
  observers: {
    'orientation, decorative, extClass': function () {
      this.sync()
    },
  },
  methods: {
    sync() {
      const orientation = toOrientation(this.properties.orientation)
      const decorative = this.properties.decorative !== false
      this.setData({
        className: separatorVariants({
          orientation,
          className: this.properties.extClass,
        }),
        role: decorative ? 'none' : 'separator',
        ariaOrientation: decorative ? '' : orientation,
      })
    },
  },
})
