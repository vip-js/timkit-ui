import { bannerVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    variant: { type: String, value: 'default' },
    dismissible: { type: Boolean, value: false },
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
        className: bannerVariants({ className: this.properties.extClass }),
      })
    },
  },
  observers: {
    open(val: boolean | null) {
      if (val == null) return
      const open = val === true
      if (this.data.open === open) return
      this.setData({ open })
    },
    extClass(extClass: string) {
      this.setData({
        className: bannerVariants({ className: extClass }),
      })
    },
  },
  methods: {
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onCloseTap()
    },
    onCloseTap() {
      if (!this.properties.dismissible || !this.data.open) return
      if (this.properties.open == null) this.setData({ open: false })
      this.triggerEvent('change', { open: false })
      this.triggerEvent('close')
    },
  },
})
