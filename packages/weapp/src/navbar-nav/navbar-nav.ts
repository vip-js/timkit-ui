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
    'aria-label': {
      type: String,
      value: '',
    },
    'aria-labelledby': {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
    ariaLabel: '',
    labelledBy: '',
  },
  lifetimes: {
    attached() {
      this.setData({
        className: `flex items-center gap-4 ${this.properties.extClass}`.trim(),
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
    },
  },
  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby'(next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    extClass(extClass) {
      this.setData({
        className: `flex items-center gap-4 ${extClass}`.trim(),
      })
    },
  },
})
