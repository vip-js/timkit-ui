import {
  dialogCloseVariants,
  dialogContentVariants,
  dialogOverlayVariants,
  resolveClasses,
} from '../utils'

Component({
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    contentClass: '',
    overlayClass: '',
    closeClass: '',
  },
  observers: {
    'extClass, open': function (extClass, open) {
      // We map 'data-state' to simple class logic if needed,
      // but strictly 'open' controls visibility in WXML via root-portal wx:if.
      // However, for exit animations to work, we might need a lingering state?
      // For now, simple wx:if.
      // We pass `data-state="open"` to the classes just in case utilities use it.
      // Actually resolveClasses resolves static classes.
      // If variants use `data-[state=open]`, resolveClasses needs a variant prop?
      // cva({ state: 'open' })?
      // React "data-state" is an attribute. Tailwind uses attribute selector.
      // Weapp `root-portal` content needs `data-state="open"`.

      const contentClass = resolveClasses(dialogContentVariants(), extClass)
      const overlayClass = resolveClasses(dialogOverlayVariants())
      const closeClass = resolveClasses(dialogCloseVariants())

      this.setData({
        contentClass,
        overlayClass,
        closeClass,
      })
    },
  },
  methods: {
    close() {
      this.triggerEvent('close')
    },
    noop() {},
  },
})
