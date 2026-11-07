import { emitTimEvent } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    src: {
      type: String,
      value: '',
    },
    width: {
      type: null,
      value: null,
    },
    height: {
      type: null,
      value: null,
    },
    x: {
      type: null,
      value: null,
    },
    y: {
      type: null,
      value: null,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    aspect: {
      type: null,
      value: null,
    },
    'aria-label': {
      type: String,
      value: '',
    },
    id: {
      type: String,
      value: 'image-cropper',
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
    ratioStatus: '',
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
      this.syncFromProps()
    },
  },

  observers: {
    'x, y, width, height': function () {
      this.syncFromProps()
    },
    x() {
      this.syncFromProps()
    },
    y() {
      this.syncFromProps()
    },
    width() {
      this.syncFromProps()
    },
    height() {
      this.syncFromProps()
    },
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    aspect() {
      this.syncFromProps()
    },
  },

  methods: {
    readCrop(value: unknown, fallback: number, current: number) {
      if (value == null) return fallback
      if (value === '') return current
      const next = Number(value)
      return Number.isFinite(next) ? next : current
    },
    clampSize(value: number) {
      if (!Number.isFinite(value)) return 10
      return Math.min(100, Math.max(10, value))
    },
    aspectRatio() {
      const ratio = Number(this.properties.aspect)
      return Number.isFinite(ratio) && ratio > 0 ? ratio : 0
    },
    syncFromProps() {
      const ratio = this.aspectRatio()
      const widthOpen = this.properties.width == null || this.properties.width === ''
      const heightOpen = this.properties.height == null || this.properties.height === ''
      let cropWidth = this.readCrop(this.properties.width, 80, this.data.cropWidth)
      let cropHeight = this.readCrop(this.properties.height, 80, this.data.cropHeight)
      if (ratio && widthOpen && heightOpen) cropHeight = this.clampSize(cropWidth / ratio)
      else if (ratio && !widthOpen && heightOpen) cropHeight = this.clampSize(cropWidth / ratio)
      else if (ratio && widthOpen && !heightOpen) cropWidth = this.clampSize(cropHeight * ratio)
      this.setData({
        cropX: this.readCrop(this.properties.x, 10, this.data.cropX),
        cropY: this.readCrop(this.properties.y, 10, this.data.cropY),
        cropWidth,
        cropHeight,
        ratioStatus: ratio ? `${ratio} to 1` : '',
      })
    },

    onXChange(e: WechatMiniprogram.SliderChange) {
      if (this.properties.disabled) return
      const x = Number(e.detail.value)
      if (this.properties.x != null) {
        this.triggerEvent('change', { x })
        return
      }
      this.setData({ cropX: x })
    },

    onYChange(e: WechatMiniprogram.SliderChange) {
      if (this.properties.disabled) return
      const y = Number(e.detail.value)
      if (this.properties.y != null) {
        this.triggerEvent('change', { y })
        return
      }
      this.setData({ cropY: y })
    },

    onWidthChange(e: WechatMiniprogram.SliderChange) {
      if (this.properties.disabled) return
      const width = Number(e.detail.value)
      const ratio = this.aspectRatio()
      const height = ratio ? this.clampSize(width / ratio) : this.data.cropHeight
      const update: { cropWidth?: number; cropHeight?: number } = {}
      if (this.properties.width == null) update.cropWidth = width
      if (ratio && this.properties.height == null) update.cropHeight = height
      if (update.cropWidth != null || update.cropHeight != null) this.setData(update)
      this.triggerEvent('change', ratio ? { width, height } : { width })
    },

    onHeightChange(e: WechatMiniprogram.SliderChange) {
      if (this.properties.disabled) return
      const height = Number(e.detail.value)
      const ratio = this.aspectRatio()
      const width = ratio ? this.clampSize(height * ratio) : this.data.cropWidth
      const update: { cropWidth?: number; cropHeight?: number } = {}
      if (this.properties.height == null) update.cropHeight = height
      if (ratio && this.properties.width == null) update.cropWidth = width
      if (update.cropWidth != null || update.cropHeight != null) this.setData(update)
      this.triggerEvent('change', ratio ? { height, width } : { height })
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
      emitTimEvent(this, 'change', 'change', this.properties.id || 'image-cropper', detail)
    },
  },
})
