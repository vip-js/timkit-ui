import { emitTimEvent } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    options: {
      type: Array,
      value: [],
    },
    value: {
      type: Number,
      value: 0,
    },
    id: {
      type: String,
      value: 'select-native',
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
    displayText: '',
  },
  lifetimes: {
    attached() {
      this.updateDisplay()
      this.setData({
        className:
          `border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex w-full cursor-pointer appearance-none items-center rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    'options, value, extClass': function () {
      this.updateDisplay()
      this.setData({
        className:
          `border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex w-full cursor-pointer appearance-none items-center rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] ${this.properties.extClass}`.trim(),
      })
    },
  },
  methods: {
    updateDisplay() {
      const options = this.properties.options || []
      const value = this.properties.value || 0
      const displayText = options[value] || ''
      this.setData({ displayText })
    },
    handleChange(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
      const value = Number(e.detail.value)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'select-native', {
        value,
      })
      this.setData({ displayText: (this.properties.options || [])[value] || '' })
    },
  },
})
