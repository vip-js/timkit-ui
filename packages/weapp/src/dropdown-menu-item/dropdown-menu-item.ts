import { resolveClasses } from '../utils'

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
    disabled: { type: Boolean, value: false },
    label: { type: String, value: '' },
    inset: { type: Boolean, value: false },
    closeOnSelect: { type: Boolean, value: true },
    extClass: { type: String, value: '' },
  },
  data: {
    className: '',
    active: false,
  },
  observers: {
    'extClass, inset': function (extClass: string, inset: boolean) {
      const base =
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm'
      const insetClass = inset ? 'pl-8' : ''
      this.setData({
        className: resolveClasses(base, insetClass, extClass),
      })
    },
  },
  methods: {
    parentNode() {
      const parents =
        typeof this.getRelationNodes === 'function'
          ? this.getRelationNodes('../dropdown-menu/dropdown-menu')
          : []
      return parents[0] as { close?: () => void; onKey?: (event: { detail?: { key?: string } }) => void } | undefined
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
      if (key === 'Escape') {
        this.parentNode()?.close?.()
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp' || /^[a-z]$/i.test(key)) this.parentNode()?.onKey?.(event)
    },
    onSelect() {
      if (this.properties.disabled) return
      this.triggerEvent('select')
      if (this.properties.closeOnSelect) this.parentNode()?.close?.()
    },
  },
})
