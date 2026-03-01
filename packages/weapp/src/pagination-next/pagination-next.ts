Component({
  options: {
    styleIsolation: "apply-shared",
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
        className: `inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm ${extClass}`.trim(),
      })
    },
  },
})
