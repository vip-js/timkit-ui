Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    openDelay: {
      type: Number,
      value: 120,
    },
    closeDelay: {
      type: Number,
      value: 100,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    open: {
      type: null,
      value: null,
    },
    defaultOpen: {
      type: null,
      value: null,
    },
    extClass: {
      type: String,
      value: '',
    },
    id: {
      type: String,
      value: 'hover-card',
    },
  },

  data: {
    open: false,
    openStatus: '',
    _openTimer: 0,
    _closeTimer: 0,
  },

  lifetimes: {
    attached() {
      const passed = this.properties.open
      const source = passed == null ? this.properties.defaultOpen : passed
      if (source === true) this.setData({ open: true, openStatus: 'Opened' })
    },
  },

  observers: {
    open(next: unknown) {
      if (next == null) return
      const open = next === true
      if (open === Boolean(this.data.open)) return
      this.clearTimers()
      this.setData({ open, openStatus: open ? 'Opened' : '' })
      this.triggerEvent('openChange', { open })
    },
    disabled(disabled: boolean) {
      if (!disabled) return
      this.clearTimers()
      if (this.data.open) {
        this.setData({ open: false, openStatus: '' })
        this.triggerEvent('openChange', { open: false })
      }
    },
  },

  methods: {
    clearTimers() {
      if (this.data._openTimer) clearTimeout(this.data._openTimer)
      if (this.data._closeTimer) clearTimeout(this.data._closeTimer)
      this.setData({ _openTimer: 0, _closeTimer: 0 })
    },

    onTriggerEnter() {
      if (this.properties.disabled) return
      this.clearTimers()
      const timer = setTimeout(() => {
        if (this.properties.disabled) return
        if (this.properties.open == null) this.setData({ open: true, openStatus: 'Opened' })
        this.triggerEvent('openChange', { open: true })
      }, this.properties.openDelay)
      this.setData({ _openTimer: Number(timer) })
    },

    onTriggerLeave() {
      this.scheduleClose()
    },

    onTriggerFocus() {
      this.onTriggerEnter()
    },

    onTriggerBlur() {
      if (this.properties.disabled || !this.data.open) return
      this.clearTimers()
      if (this.properties.open == null) this.setData({ open: false, openStatus: '' })
      this.triggerEvent('openChange', { open: false })
    },

    onKey(event: { detail?: { key?: string } }) {
      if (event?.detail?.key !== 'Escape') return
      if (this.properties.disabled || !this.data.open) return
      this.clearTimers()
      if (this.properties.open == null) this.setData({ open: false, openStatus: '' })
      this.triggerEvent('openChange', { open: false })
    },

    onContentEnter() {
      this.clearTimers()
    },

    onContentLeave() {
      this.scheduleClose()
    },

    scheduleClose() {
      if (this.properties.disabled) return
      this.clearTimers()
      const timer = setTimeout(() => {
        if (this.properties.open == null) this.setData({ open: false, openStatus: '' })
        this.triggerEvent('openChange', { open: false })
      }, this.properties.closeDelay)
      this.setData({ _closeTimer: Number(timer) })
    },
  },
})
