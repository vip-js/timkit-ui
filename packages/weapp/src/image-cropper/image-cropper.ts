Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    src: {
      type: String,
      value: '',
    },
    width: {
      type: Number,
      value: 80,
    },
    height: {
      type: Number,
      value: 80,
    },
    x: {
      type: Number,
      value: 10,
    },
    y: {
      type: Number,
      value: 10,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    cropX: 10,
    cropY: 10,
    cropWidth: 80,
    cropHeight: 80,
  },

  lifetimes: {
    attached() {
      this.syncFromProps()
    },
  },

  observers: {
    'x, y, width, height': function () {
      this.syncFromProps()
    },
  },

  methods: {
    syncFromProps() {
      this.setData({
        cropX: this.properties.x,
        cropY: this.properties.y,
        cropWidth: this.properties.width,
        cropHeight: this.properties.height,
      })
    },

    onXChange(e: WechatMiniprogram.SliderChange) {
      this.setData({ cropX: e.detail.value })
    },

    onYChange(e: WechatMiniprogram.SliderChange) {
      this.setData({ cropY: e.detail.value })
    },

    onWidthChange(e: WechatMiniprogram.SliderChange) {
      this.setData({ cropWidth: e.detail.value })
    },

    onHeightChange(e: WechatMiniprogram.SliderChange) {
      this.setData({ cropHeight: e.detail.value })
    },

    onApplyCrop() {
      if (this.properties.disabled) return
      const detail = {
        src: this.properties.src,
        rect: {
          x: this.data.cropX,
          y: this.data.cropY,
          width: this.data.cropWidth,
          height: this.data.cropHeight,
        },
      }
      this.triggerEvent('crop', detail)
      this.triggerEvent('change', detail)
    },
  },
})
