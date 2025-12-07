import { avatarFallbackVariants, avatarImageVariants, avatarVariants } from '@timui/shared'

import { resolveClasses } from '../utils'

Component({
  properties: {
    src: {
      type: String,
      value: '',
    },
    alt: {
      type: String,
      value: 'avatar',
    },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    baseClass: '',
    imageClass: '',
    fallbackClass: '',
  },
  observers: {
    extClass: function (extClass) {
      const { baseClass } = resolveClasses(avatarVariants(), extClass)
      // Image and Fallback generally don't take external classes in simple usage,
      // but we could expose props if needed. For now, just defaults.
      const { baseClass: imageClass } = resolveClasses(avatarImageVariants())
      const { baseClass: fallbackClass } = resolveClasses(avatarFallbackVariants())

      this.setData({
        baseClass,
        imageClass,
        fallbackClass,
      })
    },
  },
})
