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
        className: `flex flex-row items-center gap-1 ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `flex flex-row items-center gap-1 ${extClass}`.trim(),
      })
    },
  },
})
