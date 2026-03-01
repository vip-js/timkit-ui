Component({
  relations: {
    '../dropdown-menu-trigger/dropdown-menu-trigger': {
      type: 'child',
    },
    '../dropdown-menu-content/dropdown-menu-content': {
      type: 'child',
    },
  },
  data: {
    open: false,
  },
  methods: {
    toggle() {
      if (this.data.open) {
        this.close?.()
      } else {
        this.open?.()
      }
    },
    async open() {
      const triggers = this.getRelationNodes('../dropdown-menu-trigger/dropdown-menu-trigger')
      const contents = this.getRelationNodes('../dropdown-menu-content/dropdown-menu-content')

      if (!triggers.length || !contents.length) return

      const trigger = triggers[0]
      const content = contents[0]

      const triggerRect = await trigger.getRect?.()
      if (!triggerRect) return

      const { bottom, left } = triggerRect
      if (bottom === undefined || left === undefined) return

      content.showForMeasure?.()

      setTimeout(async () => {
        const contentRect = await content.getRect?.()
        if (!contentRect) return

        const top = bottom + 4
        const leftValue = left

        content.updatePosition?.(top, leftValue)
        this.setData({ open: true })
      }, 50)
    },
    close() {
      const contents = this.getRelationNodes('../dropdown-menu-content/dropdown-menu-content')
      if (contents.length) {
        contents[0]?.hide?.()
      }
      this.setData({ open: false })
    },
  },
})
