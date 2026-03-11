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
        className: `line-clamp-1 ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `line-clamp-1 ${extClass}`.trim(),
      })
    },
  },
})
