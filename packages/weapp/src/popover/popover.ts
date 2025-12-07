Component({
  relations: {
    '../popover-trigger/popover-trigger': {
      type: 'child', // Trigger usually inside
    },
    '../popover-content/popover-content': {
      type: 'child', // Content usually inside
    },
  },
  data: {
    visible: false,
  },
  methods: {
    toggle() {
      if (this.data.visible) {
        this.close()
      } else {
        this.open()
      }
    },
    async open() {
      const triggers = this.getRelationNodes('../popover-trigger/popover-trigger')
      const contents = this.getRelationNodes('../popover-content/popover-content')

      if (!triggers.length || !contents.length) return

      const trigger = triggers[0]
      const content = contents[0]

      // 1. Get Trigger Rect
      const triggerRect = await trigger.getRect()
      if (!triggerRect) return

      // 2. Open content (invisible state to measure)
      content.showForMeasure()

      // 3. Get Content Rect (Wait for render)
      // We need a small delay or ensure measure works
      setTimeout(async () => {
        const contentRect = await content.getRect()
        if (!contentRect) return

        // 4. Compute Position (Simple Bottom Center for now)
        // International Standard requires auto-placement (floating-ui),
        // but we start with Bottom Center + Offset 4px.
        const top = triggerRect.bottom + 4
        const left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2

        // 5. Update Content
        content.updatePosition(top, left)

        this.setData({ visible: true })
      }, 50)
    },
    close() {
      const contents = this.getRelationNodes('../popover-content/popover-content')
      if (contents.length) {
        contents[0].hide()
      }
      this.setData({ visible: false })
    },
  },
})
