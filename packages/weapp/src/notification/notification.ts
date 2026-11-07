Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    variant: { type: String, value: 'default' },
    duration: { type: Number, value: 5000 },
    closable: { type: Boolean, value: true },
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    open: true,
  },
  lifetimes: {
    attached() {
      const passed = this.properties.open
      const source = passed == null ? this.properties.defaultOpen : passed
      this.setData({
        open: source == null ? true : source === true,
        className:
          `bg-background text-foreground relative w-full rounded-md border px-4 py-3 shadow-lg ${this.properties.extClass}`.trim(),
      })
      this.arm()
    },
    detached() {
      this.clearTimer()
    },
  },
  observers: {
    extClass(extClass: string) {
      this.setData({
        className:
          `bg-background text-foreground relative w-full rounded-md border px-4 py-3 shadow-lg ${extClass}`.trim(),
      })
    },
    duration() {
      this.arm()
    },
    open(val: boolean | null) {
      if (val == null) return
      const open = val === true
      if (this.data.open === open) return
      this.setData({ open })
      this.arm()
    },
  },
  methods: {
    clearTimer() {
      if (this._timer) clearTimeout(this._timer)
      this._timer = undefined
    },
    arm() {
      this.clearTimer()
      const duration = Number(this.properties.duration)
      if (!this.data.open || !duration || duration <= 0) return
      this._timer = setTimeout(() => {
        this.close()
      }, duration)
    },
    close() {
      if (!this.data.open) return
      this.clearTimer()
      if (this.properties.open == null) this.setData({ open: false })
      this.triggerEvent('change', { open: false })
      this.triggerEvent('close')
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      if (!this.properties.closable) return
      this.close()
    },
  },
})
