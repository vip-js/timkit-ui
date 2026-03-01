import { resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: "apply-shared",
  },
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    value: { type: String, value: '' },
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: true },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
      const base = 'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm'
      this.setData({
        className: resolveClasses(base, extClass),
      })
    },
  },
  methods: {
    onSelect() {
      if (this.properties.disabled) return
      this.triggerEvent('change', { value: this.properties.value })
      if (this.properties.closeOnSelect) {
        const parents = this.getRelationNodes('../dropdown-menu/dropdown-menu')
        if (parents.length) {
          parents[0].close()
        }
      }
    },
  },
})
