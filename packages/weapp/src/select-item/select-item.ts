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
    disabled: {
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
          `relative flex w-full items-center rounded-sm py-3 pl-8 pr-2 text-sm ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className:
          `relative flex w-full items-center rounded-sm py-3 pl-8 pr-2 text-sm ${extClass}`.trim(),
      })
    },
  },
})
