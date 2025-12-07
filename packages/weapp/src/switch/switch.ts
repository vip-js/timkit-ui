import { switchThumbVariants, switchVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  properties: {
    checked: {
      type: Boolean,
      value: false,
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
    baseClass: '',
    thumbClass: '',
  },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(switchVariants(), extClass)
      const { baseClass: thumbClass } = resolveClasses(switchThumbVariants())

      this.setData({
        baseClass,
        thumbClass,
      })
    },
  },
  methods: {
    handleTap() {
      if (this.data.disabled) return
      const newValue = !this.data.checked
      this.setData({ checked: newValue })
      this.triggerEvent('change', { value: newValue })
    },
  },
})
