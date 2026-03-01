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
        className: `-mx-1 my-1 h-px bg-muted ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className: `-mx-1 my-1 h-px bg-muted ${extClass}`.trim(),
      })
    },
  },
})
