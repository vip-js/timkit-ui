import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
      this.setData({
        className: resolveClasses('inline-flex items-center', extClass),
      })
    },
  },
  methods: {
    onTap() {
      if (this.properties.disabled) return
      const parents = this.getRelationNodes('../dropdown-menu/dropdown-menu')
      if (parents.length) {
        parents[0].toggle()
      }
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('#dropdown-menu-trigger')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
  },
})
