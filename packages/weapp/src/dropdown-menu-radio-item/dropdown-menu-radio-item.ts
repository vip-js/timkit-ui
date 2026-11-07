import { emitTimEvent, resolveClasses } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  relations: {
    '../dropdown-menu/dropdown-menu': {
      type: 'parent',
      linked(target: { registerItem?: (node: object) => void }) {
        target?.registerItem?.(this)
      },
      unlinked(target: { unregisterItem?: (node: object) => void }) {
        target?.unregisterItem?.(this)
      },
    },
  },
  externalClasses: ['ext-class'],
  properties: {
    value: { type: String, value: '' },
    label: { type: String, value: '' },
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: true },
    id: { type: String, value: 'dropdown-menu-radio-item' },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    on: false,
    active: false,
  },

  lifetimes: {
    attached() {
      const parents =
        typeof this.getRelationNodes === 'function'
          ? (this.getRelationNodes('../dropdown-menu/dropdown-menu') as Array<{ data?: { radioValue?: string } }>)
          : []
      const selected = parents[0]?.data?.radioValue
      const mine = String(this.properties.value || '')
      this.setData({
        on: selected ? mine === selected : this.properties.checked === true,
      })
    },
  },
  observers: {
    checked(next: unknown) {
      const on = !!next
      if (on === !!this.data.on) return
      this.setData({ on })
    },
    extClass: function (extClass: string) {
      const base =
        'relative flex cursor-default select-none items-center rounded-sm py-3 pl-8 pr-2 text-sm'
      this.setData({
        className: resolveClasses(base, extClass),
      })
    },
  },
  methods: {
    setChecked(on: boolean) {
      this.setData({ on: !!on })
    },
    setActive(on: boolean) {
      this.setData({ active: !!on })
    },
    activate() {
      this.onSelect()
    },
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') {
        this.onSelect()
        return
      }
      const parents =
        typeof this.getRelationNodes === 'function'
          ? this.getRelationNodes('../dropdown-menu/dropdown-menu')
          : []
      const parent = parents[0] as { close?: () => void; onKey?: (event?: { detail?: { key?: string } }) => void } | undefined
      if (key === 'Escape') parent?.close?.()
      if (key === 'ArrowDown' || key === 'ArrowUp' || /^[a-z]$/i.test(key)) parent?.onKey?.(event)
    },

    onSelect() {
      if (this.properties.disabled) return
      const parents =
        typeof this.getRelationNodes === 'function'
          ? this.getRelationNodes('../dropdown-menu/dropdown-menu')
          : []
      const parent = parents[0] as {
        properties?: { disabled?: boolean }
        selectRadio?: (value: string) => void
        close?: () => void
      }
      if (parent?.properties?.disabled) return
      if (parent?.selectRadio) {
        parent.selectRadio(String(this.properties.value || ''))
      } else {
        this.setData({ on: true })
        emitTimEvent(this, 'change', 'change', this.properties.id || 'dropdown-menu-radio-item', {
          value: this.properties.value,
        })
      }
      if (this.properties.closeOnSelect) parent?.close?.()
    },
  },
})
