import { popoverContentVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  relations: {
    '../popover/popover': {
      type: 'parent',
    },
  },
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    visible: false,
    style: 'opacity: 0;', // Initial hidden
    baseClass: '',
  },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(popoverContentVariants(), extClass)
      this.setData({ baseClass })
    },
  },
  methods: {
    showForMeasure() {
      this.setData({
        visible: true,
        style: 'opacity: 0; pointer-events: none;',
      })
    },
    updatePosition(top: number, left: number) {
      this.setData({
        style: `top: ${top}px; left: ${left}px; opacity: 1; transition: opacity 0.2s;`,
      })
    },
    hide() {
      this.setData({ visible: false, style: 'opacity: 0;' })
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('.tk-popover-content')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
    noop() {},
  },
})
