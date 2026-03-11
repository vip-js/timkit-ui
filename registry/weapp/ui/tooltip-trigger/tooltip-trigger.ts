Component({
  relations: {
    '../tooltip/tooltip': { type: 'ancestor' },
  },
  data: {
    triggerApi: {} as any,
  },
  methods: {
    updateFromParent(parentApi) {
      if (!parentApi) return
      this.setData({ triggerApi: parentApi.triggerProps })
    },
    // Tooltip trigger usually needs hover or long press in mobile?
    // Zag tooltip trigger uses pointer/mouse events.
    // WeApp uses bindtap, bindlongpress, etc.
    // Zag default triggerProps might include onPointerEnter/Leave.
    // We map touch events?
    // For now, let's map tap to toggle for simplicity on mobile, or longpress.
    // But standard "Tooltip" on mobile is rare.
    // Let's assume click/tap for now.
    handleTap() {
      // Tooltip on mobile often behaves like Popover.
      // Zag tooltip behavior might need adjustment.
      // Zag trigger props probably has onClick? No, usually pointerover.
      // We might simply not implement interactivity here if Zag logic is purely pointer-based.
      // But let's try mapping handleTap to api.open() if possible?
      // This requires exposing open/close from parent.
      // But parentApi.triggerProps handles it.
      // If triggerProps has onPointerEnter, we can try stimulating it?
      // Actually, Zag tooltip trigger props: onPointerEnter, onPointerLeave, onFocus, onBlur.
      // We can map bindtap to onFocus?
      if (this.data.triggerApi.onFocus) this.data.triggerApi.onFocus()
      // On blur?
    },
    handleBlur() {
      if (this.data.triggerApi.onBlur) this.data.triggerApi.onBlur()
    },
  },
})
