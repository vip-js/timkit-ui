Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    orientation: {
      type: String,
      value: 'vertical',
    },
    scrollY: {
      type: null,
      value: null,
    },
    scrollX: {
      type: null,
      value: null,
    },
    height: {
      type: String,
      value: '320rpx',
    },
    extClass: {
      type: String,
      value: '',
    },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
  },

  data: {
    axisX: false,
    axisY: true,
    axisStatus: 'Vertical',
    ariaLabel: '',
    labelledBy: '',
  },

  lifetimes: {
    attached() {
      this.sync()
      this.setData({
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
    'orientation, scrollX, scrollY': function () {
      this.sync()
    },
    orientation() {
      this.sync()
    },
    scrollX() {
      this.sync()
    },
    scrollY() {
      this.sync()
    },
  },

  methods: {
    axisText(axisX: boolean, axisY: boolean) {
      if (axisX && axisY) return 'Both'
      if (axisX) return 'Horizontal'
      if (axisY) return 'Vertical'
      return ''
    },
    sync() {
      const orientation = this.properties.orientation
      const fromX = orientation === 'horizontal' || orientation === 'both'
      const fromY = orientation === 'vertical' || orientation === 'both'
      const axisX = this.properties.scrollX == null ? fromX : this.properties.scrollX === true
      const axisY = this.properties.scrollY == null ? fromY : this.properties.scrollY === true
      this.setData({ axisX, axisY, axisStatus: this.axisText(axisX, axisY) })
    },
    onScroll(e: WechatMiniprogram.ScrollViewScroll) {
      this.triggerEvent('scroll', e.detail)
    },
  },
})
