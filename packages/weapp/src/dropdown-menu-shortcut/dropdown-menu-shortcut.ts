import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
      this.setData({
        className: resolveClasses('ml-auto text-xs tracking-widest opacity-60', extClass),
      })
    },
  },
})
