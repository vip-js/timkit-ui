import { resolveClasses } from '../utils'

Component({
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    visible: false,
    style: 'opacity: 0;',
    className: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: resolveClasses(
          'z-50 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          extClass
        ),
      })
    },
  },
  methods: {
    showForMeasure() {
      this.setData({
        visible: true,
        style: 'position: fixed; top: 0; left: 0; opacity: 0; pointer-events: none;',
      })
    },
    updatePosition(top, left) {
      const topValue = typeof top === 'number' ? top : Number(top ?? 0)
      const leftValue = typeof left === 'number' ? left : Number(left ?? 0)
      this.setData({
        style: `position: fixed; top: ${topValue}px; left: ${leftValue}px; opacity: 1; transition: opacity 0.2s;`,
      })
    },
    hide() {
      this.setData({ visible: false, style: 'opacity: 0;' })
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('#dropdown-menu-content')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
    noop() {},
  },
})
