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
    active: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    className: '',
  },
  lifetimes: {
    attached() {
      this.setData({
        className:
          `inline-flex items-center justify-center rounded-md px-2.5 py-3 text-sm ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className:
          `inline-flex items-center justify-center rounded-md px-2.5 py-3 text-sm ${extClass}`.trim(),
      })
    },
  },
})
