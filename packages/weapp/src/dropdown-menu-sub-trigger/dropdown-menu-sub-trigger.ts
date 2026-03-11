import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    inset: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    'extClass, inset': function (extClass: string, inset: boolean) {
      const base = 'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm'
      const insetClass = inset ? 'pl-8' : ''
      this.setData({
        className: resolveClasses(base, insetClass, extClass),
      })
    },
  },
})
