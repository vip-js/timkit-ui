Component({
  data: { open: false },
  methods: {
    open() {
      this.setData({ open: true })
    },
    close() {
      this.setData({ open: false })
    },
  },
})
