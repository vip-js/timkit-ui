import { sheetContentVariants, sheetOverlayVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
    side: {
      type: String,
      value: 'right',
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    contentClass: '',
    overlayClass: '',
  },
  observers: {
    'extClass, side': function (extClass, side) {
      // Mapping side properly to cva
      // Note: we pass `state: open` if variants depend on it?
      // Shared variants use `data-[state=open]`.
      // We render `data-state="open"` in WXML.

      const { baseClass: contentClass } = resolveClasses(
        sheetContentVariants({ side: side as any }),
        extClass
      )
      const { baseClass: overlayClass } = resolveClasses(sheetOverlayVariants())

      this.setData({
        contentClass,
        overlayClass,
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
