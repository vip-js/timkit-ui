import { emitTimEvent, resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: false },
    id: { type: String, value: 'dropdown-menu-checkbox-item' },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
  },
  observers: {
    extClass: function (extClass: string) {
      const base =
        'relative flex cursor-default select-none items-center rounded-sm py-3 pl-8 pr-2 text-sm'
      this.setData({
        className: resolveClasses(base, extClass),
      })
    },
  },
  methods: {
    onToggle() {
      if (this.properties.disabled) return
      const nextChecked = !this.properties.checked
      emitTimEvent(this, 'change', 'change', this.properties.id || 'dropdown-menu-checkbox-item', {
        checked: nextChecked,
      })
      if (this.properties.closeOnSelect) {
        const parents = this.getRelationNodes('../dropdown-menu/dropdown-menu')
        if (parents.length) {
          parents[0].close()
        }
      }
    },
  },
})
