Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
  },
  lifetimes: {
    attached() {
      this.setData({
        className:
          `relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className:
          `relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${extClass}`.trim(),
      })
    },
  },
})
