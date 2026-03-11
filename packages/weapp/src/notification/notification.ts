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
          `bg-background text-foreground relative w-full rounded-md border px-4 py-3 shadow-lg ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className:
          `bg-background text-foreground relative w-full rounded-md border px-4 py-3 shadow-lg ${extClass}`.trim(),
      })
    },
  },
})
