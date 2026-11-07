// @ts-nocheck
import { comboboxCollection, createControl } from '@timui/core'

import { emitTimEvent } from '../utils'
import { createCollection, createScopedMachineId } from '../utils/collection'
import { commitControl, controlEventValue } from '../utils/control'
import {
  connectComboboxMachine,
  setupComboboxMachine,
  type WeappComboboxApi,
  type WeappComboboxService,
} from './use-combobox'

type ComboboxItemRecord = Record<string, object>
type ComboboxCollection = ReturnType<typeof comboboxCollection<ComboboxItemRecord>>

type WeappComboboxInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _collection: ComboboxCollection
  _service?: WeappComboboxService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappComboboxApi
  }
  properties: {
    id: string
    items: ComboboxItemRecord[]
    itemLabelKey: string
    itemValueKey: string
    value: string[]
    name: string
    disabled: boolean
    readOnly: boolean
    loop: boolean
    open: boolean | null
    defaultOpen: boolean | null
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'combobox' },
    // Basic props
    items: { type: Array, value: [] }, // Simple array of strings or objects
    itemLabelKey: { type: String, value: 'label' },
    itemValueKey: { type: String, value: 'value' },

    // Zag props
    name: { type: String, value: '' },
    form: { type: String, value: '' },
    value: { type: null, value: null }, // Combobox value is array
    defaultValue: { type: null, value: null },
    inputParams: { type: Object, value: {} }, // Pass to input
    placeholder: { type: String, value: 'Choose an item' },
    emptyLabel: { type: String, value: 'No results' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    loop: { type: Boolean, value: true },
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    invalid: { type: Boolean, value: false },
    extClass: { type: String, value: '' },

    // Mobile specific
    label: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
    'aria-labelledby': { type: String, value: '' },
  },

  data: {
    api: {} as WeappComboboxApi,
    displayValue: '',
    opened: false,
    selected: [] as string[],
    query: '',
    visibleItems: [] as ComboboxItemRecord[],
    empty: false,
    highlighted: -1,
    ariaLabel: '',
    labelledBy: '',
    control: createControl(),
  },

  lifetimes: {
    attached() {
      const self = this as WeappComboboxInternal
      const updateCollection = (items: ComboboxItemRecord[]) => {
        self._collection = createCollection({
          items,
          itemLabelKey: self.properties.itemLabelKey,
          itemValueKey: self.properties.itemValueKey,
          factory: comboboxCollection,
        })
      }
      updateCollection(this.properties.items)
      this.applyQuery('')

      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const initial =
        source == null || source === '' ? [] : Array.isArray(source) ? source : [String(source)]
      const { service, start, send } = setupComboboxMachine(this, {
        id: this.properties.id || createScopedMachineId('combobox'),
        collection: self._collection,
        value: initial,
        name: this.properties.name,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        open: this.properties.open,
        defaultOpen: this.properties.defaultOpen,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'combobox', {
            value: details.value,
          })
        },
      })

      self._service = service
      self._send = send
      self._cleanup = start()
      this.setData({
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
    },
    detached() {
      const self = this as WeappComboboxInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label'(value: unknown) {
      const next = String(value || '')
      if (next === this.data.ariaLabel) return
      this.setData({ ariaLabel: next })
    },
    'aria-labelledby'(value: unknown) {
      const next = String(value || '')
      if (next === this.data.labelledBy) return
      this.setData({ labelledBy: next })
    },
    state: function (state) {
      const self = this as WeappComboboxInternal
      if (!state || !self._send) return
      let api = self.data.api
      try {
        api = connectComboboxMachine(state, self._send)
      } catch {
        api = self.data.api
      }
      const selected = Array.isArray(api.value) ? api.value.map((item: unknown) => String(item)) : []
      const valueKey = self.properties.itemValueKey || 'value'
      const labelKey = self.properties.itemLabelKey || 'label'
      const displayValue = selected
        .map((id: string) => {
          const match = (self.properties.items ?? []).find(
            (item: ComboboxItemRecord) => String(item?.[valueKey] ?? '') === id
          )
          return match ? String(match[labelKey] ?? id) : id
        })
        .filter(Boolean)
        .join(', ')
      this.setData({
        api,
        opened: Boolean(api.open),
        selected,
        displayValue,
      })
    },
    open: function (val) {
      const self = this as WeappComboboxInternal
      if (val == null || !self._send) return
      const open = val === true
      if (Boolean(self.data.api.open) === open) return
      self._send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
    },
    value: function (val) {
      const self = this as WeappComboboxInternal
      if (val == null) return
      const next = Array.isArray(val) ? val.map((item) => String(item)) : []
      const current = Array.isArray(self.data.selected) ? self.data.selected.map((item) => String(item)) : []
      if (next.join('|') === current.join('|')) return
      self.data.api.setValue?.(next)
    },
    items: function (items) {
      const self = this as WeappComboboxInternal
      if (self._service) {
        self._collection = createCollection({
          items: items as ComboboxItemRecord[],
          itemLabelKey: self.properties.itemLabelKey,
          itemValueKey: self.properties.itemValueKey,
          factory: comboboxCollection,
        })
        self._service.setContext({ collection: self._collection as Record<string, object> })
      }
      this.applyQuery(String(this.data.query || ''))
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappComboboxInternal
      const next = commitControl(self, self.data.opened ? 'close' : 'open')
      if (next.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: self.properties.open !== true })
        return
      }
      self.data.api.setOpen?.(!self.data.opened)
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappComboboxInternal
      const value = controlEventValue(e) || String(e.mark?.value || '')
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled || self.properties.readOnly || !self._collection?.find?.(value)) return
      if (self.properties.value != null) {
        this.triggerEvent('change', { value: [value] })
        return
      }
      if (!self.data.api.selectValue) return
      self.data.api.selectValue(value)
    },
    applyQuery(query: string) {
      const self = this as WeappComboboxInternal
      const labelKey = self.properties.itemLabelKey || 'label'
      const needle = query.trim().toLowerCase()
      const source = (self.properties.items ?? []) as ComboboxItemRecord[]
      const visibleItems = needle
        ? source.filter((item) => String(item?.[labelKey] ?? '').toLowerCase().includes(needle))
        : source
      this.setData({
        query,
        visibleItems,
        empty: visibleItems.length === 0,
        highlighted: -1,
      })
    },
    onQuery(event?: { detail?: { value?: string } }) {
      const self = this as WeappComboboxInternal
      if (self.properties.disabled) return
      this.applyQuery(String(event?.detail?.value ?? ''))
    },
    enabledIndexes() {
      const self = this as WeappComboboxInternal
      return (self.data.visibleItems ?? [])
        .map((item, index) => (item && (item as { disabled?: boolean }).disabled ? -1 : index))
        .filter((index) => index >= 0)
    },
    moveHighlight(delta: number) {
      const self = this as WeappComboboxInternal
      const indexes = this.enabledIndexes()
      if (!indexes.length || !self.data.opened) return
      const place = indexes.indexOf(self.data.highlighted)
      if (place < 0) {
        const next = delta < 0 && self.properties.loop !== false ? indexes[indexes.length - 1] : indexes[0]
        this.setData({ highlighted: next })
        return
      }
      let next = place + delta
      if (self.properties.loop === false) next = Math.min(indexes.length - 1, Math.max(0, next))
      else next = (next + indexes.length) % indexes.length
      this.setData({ highlighted: indexes[next] })
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onBackdropTap()
    },
    onItemKey(event?: { detail?: { key?: string }; mark?: { value?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key !== 'Enter') return
      this.onItemTap(event)
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const self = this as WeappComboboxInternal
      if (self.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      if (key === 'Home' || key === 'End') {
        if (self.properties.readOnly) return
        if (!self.data.opened) this.onTriggerTap()
        if (!self.data.opened) return
        const indexes = this.enabledIndexes()
        if (!indexes.length) return
        this.setData({ highlighted: key === 'Home' ? indexes[0] : indexes[indexes.length - 1] })
        return
      }
      if (!self.data.opened) return
      if (key === 'Escape') {
        this.onBackdropTap()
        return
      }
      if (self.properties.readOnly) return
      if (key === 'ArrowDown') this.moveHighlight(1)
      else if (key === 'ArrowUp') this.moveHighlight(-1)
      else if (key === 'Enter') {
        const item = (self.data.visibleItems ?? [])[self.data.highlighted] as { value?: string } | undefined
        const value = item ? String(item[self.properties.itemValueKey || 'value'] ?? '') : ''
        if (!value) return
        this.onItemTap({ mark: { value } })
      }
    },
    onBackdropTap() {
      const self = this as WeappComboboxInternal
      if (self.properties.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
    },
  },
})
