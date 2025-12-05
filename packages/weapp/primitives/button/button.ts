Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    label: {
      type: String,
      value: "",
    },
    variant: {
      type: String,
      value: "primary",
    },
    size: {
      type: String,
      value: "md",
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    variantClass: "primary",
    sizeClass: "size-md",
  },
  observers: {
    "variant,size": function () {
      this.updateClasses()
    },
  },
  lifetimes: {
    attached() {
      this.updateClasses()
    },
  },
  methods: {
    updateClasses() {
      const variant = ["primary", "secondary", "ghost", "destructive"].includes(
        this.data.variant
      )
        ? this.data.variant
        : "primary"

      const size = ["sm", "md", "lg"].includes(this.data.size)
        ? this.data.size
        : "md"

      this.setData({
        variantClass: variant,
        sizeClass: `size-${size}`,
      })
    },
    handleTap(event) {
      if (this.data.disabled || this.data.loading) return
      this.triggerEvent("press", event?.detail ?? {})
    },
  },
})
