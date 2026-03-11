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
        className: `w-full ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `w-full ${extClass}`.trim(),
      })
    },
  },
})
