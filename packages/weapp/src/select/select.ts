// @ts-nocheck — WeApp Component API's `this` context is structurally incompatible with
// the custom WeappSelectInternal interface; this is a known limitation of the WeApp SDK typings.
import { createControl, reduceControl, reduceWidgetKey, selectCollection, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { publishMachine } from '../utils/machine'
import { createCollection, createScopedMachineId } from '../utils/collection'
import {
  connectSelectMachine,
  setupSelectMachine,
  type WeappSelectApi,
  type WeappSelectService,
} from './use-select'

type SelectItemRecord = Record<string, object>
type SelectCollection = ReturnType<typeof selectCollection<SelectItemRecord>>

type WeappSelectInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _collection: SelectCollection
  _service?: WeappSelectService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappSelectApi
  }
  properties: {
    id: string
    items: SelectItemRecord[]
    itemLabelKey: string
    itemValueKey: string
    value: string[]
    name: string
    disabled: boolean
    readOnly: boolean
    open: boolean | null
    defaultOpen: boolean | null
    extClass: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    id: { type: String, value: 'select' },
    items: { type: Array, value: [] },
    itemLabelKey: { type: String, value: 'label' },
    itemValueKey: { type: String, value: 'value' },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    name: { type: String, value: '' },
    placeholder: { type: String, value: 'Select an item' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    label: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappSelectApi,
    className: '',
    selected: [] as string[],
    displayValue: '',
    optionStatus: '',
    opened: false,
    highlight: 0,
    typeaheadAnchor: false,
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappSelectInternal
      this.setData({
        className: this.properties.extClass,
        ariaLabel: String(this.properties['aria-label'] || ''),
      })
      self._collection = createCollection({
        items: this.properties.items,
        itemLabelKey: self.properties.itemLabelKey,
        itemValueKey: self.properties.itemValueKey,
        factory: selectCollection,
      })

      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const initial =
        source == null || source === '' ? [] : Array.isArray(source) ? source : [String(source)]
      const { service, start, send } = setupSelectMachine(this, {
        id: this.properties.id || createScopedMachineId('select'),
        collection: self._collection,
        value: initial,
        name: this.properties.name,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        required: this.properties.required,
        open: this.properties.open,
        defaultOpen: this.properties.defaultOpen,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'select', {
            value: details.value,
          })
        },
      })

      self._service = service
      self._send = send
      self._cleanup = start()
      publishMachine(this)
    },
    detached() {
      const self = this as WeappSelectInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    state: function (state) {
      const self = this as WeappSelectInternal
      if (!state || !self._send) return
      const api = connectSelectMachine(state, self._send)
      const selected = Array.isArray(api.value) ? api.value.map((item: unknown) => String(item)) : []
      const valueKey = self.properties.itemValueKey || 'value'
      const labelKey = self.properties.itemLabelKey || 'label'
      const displayValue = selected
        .map((id: string) => {
          const match = (self.properties.items ?? []).find(
            (item: SelectItemRecord) => String(item?.[valueKey] ?? '') === id
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
        optionStatus: this.optionText(selected),
      })
    },
    items: function (items) {
      const self = this as WeappSelectInternal
      if (self._service) {
        self._collection = createCollection({
          items: items as SelectItemRecord[],
          itemLabelKey: self.properties.itemLabelKey,
          itemValueKey: self.properties.itemValueKey,
          factory: selectCollection as (items: object[]) => ListCollection<SelectItemRecord>,
        })
        self._service.setContext({ collection: self._collection as Record<string, object> })
      }
    },
    open: function (val) {
      const self = this as WeappSelectInternal
      if (val == null || !self._send) return
      const open = val === true
      if (Boolean(self.data.api.open) === open) return
      self._send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
    },
    value: function (val) {
      const self = this as WeappSelectInternal
      if (val == null) return
      const next = Array.isArray(val)
        ? val.map((item) => String(item))
        : val == null || val === ''
          ? []
          : [String(val)]
      const current = Array.isArray(self.data.selected) ? self.data.selected.map(String) : []
      if (next.join('\0') === current.join('\0')) return
      self.data.api.setValue?.(next)
    },
  },

  methods: {
    optionText(selected: string[]) {
      const open = selected.filter(Boolean)
      if (open.length === 0) return ''
      const items = this.properties.items ?? []
      const valueKey = this.properties.itemValueKey || 'value'
      if (open.length === 1) {
        const index = items.findIndex((item: { [key: string]: unknown }) => String(item?.[valueKey] ?? '') === open[0])
        return index < 0 ? '' : `Option ${index + 1} of ${items.length}`
      }
      return `${open.length} options selected`
    },
    onTriggerTap() {
      const self = this as WeappSelectInternal
      const next = reduceControl(
        {
          ...(self.data.control ?? createControl()),
          disabled: !!self.properties.disabled || !!self.properties.readOnly,
        },
        'open'
      )
      this.setData({ control: next })
      if (!next.open) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: self.properties.open !== true })
        return
      }
      const click = { defaultPrevented: false, stopPropagation() {}, preventDefault() {} }
      self.data.api.getTriggerProps?.().onClick?.(click)
      self.data.api.triggerProps?.onClick?.(click)
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappSelectInternal
      const value = String(e.mark?.value || '')
      const next = reduceControl(
        {
          ...(self.data.control ?? createControl()),
          disabled: !!self.properties.disabled || !!self.properties.readOnly,
        },
        'select',
        value
      )
      this.setData({ control: next })
      const key = self.properties.itemValueKey || 'value'
      const record = (self.properties.items ?? []).find(
        (item) => String((item as { [key: string]: unknown })?.[key] ?? item) === value
      ) as { disabled?: boolean; disable?: boolean } | undefined
      if (next.disabled || record?.disabled || record?.disable) return
      if (self.properties.value != null) {
        this.triggerEvent('change', { value: [value] })
        return
      }
      const item = self._collection?.find(value)
      if (item && self.data.api.selectValue) {
        self.data.api.selectValue(value)
        self.data.api.setOpen?.(false)
      }
    },
    onBackdropTap() {
      const self = this as WeappSelectInternal
      if (self.properties.disabled || self.properties.readOnly) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
    },
    highlightIndex() {
      const items = this.properties.items || []
      const selected = String(this.data.selected?.[0] ?? '')
      const valueKey = this.properties.itemValueKey || 'value'
      const found = items.findIndex(
        (item: SelectItemRecord) => String(item?.[valueKey] ?? item) === selected
      )
      return found >= 0 ? found : 0
    },
    onItemKey(event?: { detail?: { key?: string }; mark?: { value?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key !== 'Enter') return
      this.onItemTap(event)
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onBackdropTap()
    },
    typeaheadIndex(currentIndex: number, key: string) {
      const items = this.properties.items || []
      const labelKey = this.properties.itemLabelKey || 'label'
      const valueKey = this.properties.itemValueKey || 'value'
      const letter = key.toLowerCase()
      if (!items.length) return -1
      const start = currentIndex < 0 ? 0 : currentIndex + 1
      for (let offset = 0; offset < items.length; offset += 1) {
        const index = (start + offset) % items.length
        if (currentIndex >= 0 && index === currentIndex) continue
        const item = items[index] as { disabled?: boolean; disable?: boolean; [key: string]: unknown } | undefined
        if (!item || item.disabled || item.disable) continue
        const label = String(item[labelKey] ?? item[valueKey] ?? '')
        if (label.toLowerCase().startsWith(letter)) return index
      }
      return -1
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      if (this.properties.disabled || this.properties.readOnly) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const open = this.data.opened === true
      const items = this.properties.items || []
      if (/^[a-z]$/i.test(key)) {
        const valueKey = this.properties.itemValueKey || 'value'
        if (!open) {
          const selected = String(this.data.selected?.[0] ?? '')
          const current = items.findIndex(
            (item: { [key: string]: unknown }) => String(item?.[valueKey] ?? item) === selected
          )
          const index = this.typeaheadIndex(current, key)
          if (index < 0) return
          const item = items[index] as { [key: string]: unknown }
          this.onItemTap({ mark: { value: String(item?.[valueKey] ?? '') } })
          return
        }
        const anchor = this.data.typeaheadAnchor === true ? Number(this.data.highlight) : -1
        const index = this.typeaheadIndex(anchor, key)
        if (index < 0) return
        this.setData({ highlight: index, typeaheadAnchor: true })
        return
      }
      if (key === 'Home' || key === 'End') {
        const enabled: number[] = []
        items.forEach((item: { disabled?: boolean; disable?: boolean }, index: number) => {
          if (!item?.disabled && !item?.disable) enabled.push(index)
        })
        if (!enabled.length) return
        const index = key === 'Home' ? enabled[0] : enabled[enabled.length - 1]
        if (!open) {
          const valueKey = this.properties.itemValueKey || 'value'
          const item = items[index] as { [key: string]: unknown }
          this.onItemTap({ mark: { value: String(item?.[valueKey] ?? '') } })
          return
        }
        this.setData({ highlight: index, typeaheadAnchor: true })
        return
      }
      const next = reduceWidgetKey(
        'select',
        {
          open,
          index: Number(this.data.highlight) || 0,
          count: items.length,
          checked: false,
          value: 0,
          min: 0,
          max: 0,
          step: 1,
        },
        key
      )
      if (!next.handled) return
      if (!open && next.open) {
        this.setData({ highlight: this.highlightIndex(), typeaheadAnchor: true })
        this.onTriggerTap()
        return
      }
      if (!open) return
      if (key === 'Escape') {
        this.onBackdropTap()
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        this.setData({ highlight: next.index, typeaheadAnchor: true })
        return
      }
      if (key === 'Enter') {
        const item = items[next.index] as SelectItemRecord | undefined
        const valueKey = this.properties.itemValueKey || 'value'
        this.onItemTap({ mark: { value: String(item?.[valueKey] ?? item ?? '') } })
      }
    },
  },
})
