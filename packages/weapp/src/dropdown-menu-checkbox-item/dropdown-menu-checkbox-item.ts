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
    checked: { type: null, value: null },
    label: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: false },
    id: { type: String, value: 'dropdown-menu-checkbox-item' },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    on: false,
    active: false,
  },

  lifetimes: {
    attached() {
      this.setData({ on: this.properties.checked === true })
    },
  },
  observers: {
    checked(next: unknown) {
      if (next == null) return
      const on = next === true
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
    setActive(on: boolean) {
      this.setData({ active: !!on })
    },
    activate() {
      this.onToggle()
    },
    onKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') {
        this.onToggle()
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
    onToggle() {
      if (this.properties.disabled) return
      const nextChecked = !this.data.on
      if (this.properties.checked == null) this.setData({ on: nextChecked })
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
