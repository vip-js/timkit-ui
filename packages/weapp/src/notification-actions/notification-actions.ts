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
        className: `flex items-center gap-2 ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `flex items-center gap-2 ${extClass}`.trim(),
      })
    },
  },
})
