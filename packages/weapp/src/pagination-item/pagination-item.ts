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
        className: this.properties.extClass || '',
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: extClass || '',
      })
    },
  },
})
