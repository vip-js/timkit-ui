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
    extClass: { type: String, value: '' },
  },
  data: {
    visible: false,
    style: 'opacity: 0;',
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
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
    updatePosition(top: number, left: number) {
      this.setData({
        style: `position: fixed; top: ${top}px; left: ${left}px; opacity: 1; transition: opacity 0.2s;`,
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
