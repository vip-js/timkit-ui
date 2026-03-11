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
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    open: false,
    _openTimer: 0,
    _closeTimer: 0,
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
        this.setData({ open: true })
        this.triggerEvent('openChange', { open: true })
      }, this.properties.openDelay)
      this.setData({ _openTimer: Number(timer) })
    },

    onTriggerLeave() {
      this.scheduleClose()
    },

    onContentEnter() {
      this.clearTimers()
    },

    onContentLeave() {
      this.scheduleClose()
    },

    scheduleClose() {
      this.clearTimers()
      const timer = setTimeout(() => {
        this.setData({ open: false })
        this.triggerEvent('openChange', { open: false })
      }, this.properties.closeDelay)
      this.setData({ _closeTimer: Number(timer) })
    },
  },
})
