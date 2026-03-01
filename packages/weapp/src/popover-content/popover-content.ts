import { popoverContentVariants } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
  relations: {
    '../popover/popover': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    visible: false,
    style: 'opacity: 0;', // Initial hidden
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
      this.setData({
        // Simulating data-state for variants if needed?
        // Shared variant uses `data-[state=open]:animate-in`.
        // WeApp won't trigger that animation naturally without state change.
        // For now, allow base classes.
        className: popoverContentVariants({ className: extClass })
      })
    }
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
          .select('#popover-content')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
    noop() { },
  },
})
