Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
  },
  data: {
    expanded: false,
  },
  relations: {
    '../popover/popover': {
      type: 'parent',
    },
  },
  methods: {
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onTap()
    },
    onTap() {
      if (this.properties.disabled) return
      const parents = this.getRelationNodes('../popover/popover') as Array<{
        onTriggerTap?: () => void
        data?: { opened?: boolean }
      }>
      const parent = parents[0]
      parent?.onTriggerTap?.()
      this.setData({ expanded: parent?.data?.opened === true })
    },
    getRect() {
      return new Promise((resolve) => {
        this.createSelectorQuery()
          .select('#popover-trigger')
          .boundingClientRect((rect) => {
            resolve(rect)
          })
          .exec()
      })
    },
  },
})
