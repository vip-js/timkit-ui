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
        className:
          `flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    extClass(extClass) {
      this.setData({
        className:
          `flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ${extClass}`.trim(),
      })
    },
  },
})
