import { resolveClasses } from '../utils'

Component({
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    disabled: { type: Boolean, value: false },
    inset: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: true },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    'extClass, inset': function (extClass, inset) {
      const base =
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm'
      const insetClass = inset ? 'pl-8' : ''
      this.setData({
        className: resolveClasses(base, insetClass, extClass),
      })
    },
  },
  methods: {
    onSelect() {
      if (this.properties.disabled) return
      this.triggerEvent('select')
      if (this.properties.closeOnSelect) {
        const parents = this.getRelationNodes('../dropdown-menu/dropdown-menu')
        if (parents.length) {
          parents[0]?.close?.()
        }
      }
    },
  },
})
