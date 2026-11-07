import { createControl, reduceWidgetKey, selectCollection, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { createCollection, createScopedMachineId } from '../utils/collection'
import { commitControl, controlEventValue } from '../utils/control'
import { setupMultiselectMachine } from './use-multiselect'

type SelectItemRecord = Record<string, object>
type SelectCollection = ReturnType<typeof selectCollection<SelectItemRecord>>
type MachineSend = (event: string | { type: string; [key: string]: object }) => void

type WeappMultiselectApi = {
  open?: boolean
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
  setValue?: (value: string[]) => void
  value?: string[]
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type WeappMultiselectInternal = WechatMiniprogram.Component.InstanceMethods<
  Record<string, object>
> & {
  _collection?: SelectCollection
  _service?: WeappService
  _cleanup?: () => void
  _send?: MachineSend
  _connect?: (state: object, send: MachineSend) => WeappMultiselectApi
  data: {
    api: WeappMultiselectApi
    opened: boolean
    selected: string[]
    control?: ControlState
  }
  properties: {
    id: string
    items: SelectItemRecord[]
    itemLabelKey: string
    itemValueKey: string
    value: string[]
    name: string
    disabled: boolean
    open: boolean | null
    defaultOpen: boolean | null
    multiple: boolean
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
    id: { type: String, value: 'multiselect' },
    items: { type: Array, value: [] },
    itemLabelKey: { type: String, value: 'label' },
    itemValueKey: { type: String, value: 'value' },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    name: { type: String, value: '' },
    placeholder: { type: String, value: 'Select an item' },
    disabled: { type: Boolean, value: false },
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    label: { type: String, value: '' },
    multiple: { type: Boolean, value: true },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappMultiselectApi,
    className: '',
    opened: false,
    highlight: 0,
    selected: [] as string[],
    optionStatus: '',
    displayValue: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappMultiselectInternal
      this.setData({ className: this.properties.extClass })
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
      const { service, start, send, connect } = setupMultiselectMachine(this, {
        id: this.properties.id || createScopedMachineId('multiselect'),
        collection: self._collection,
        value: initial,
        name: this.properties.name,
        disabled: this.properties.disabled,
        open: this.properties.open,
        defaultOpen: this.properties.defaultOpen,
        multiple: this.properties.multiple,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'multiselect', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._send = send
      self._connect = connect
      self._cleanup = start()
    },
    detached() {
      const self = this as WeappMultiselectInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappMultiselectInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
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
    open: function (val) {
      const self = this as WeappMultiselectInternal
      if (val == null || !self._send) return
      const open = val === true
      if (Boolean(self.data.api.open) === open) return
      self._send({ type: open ? 'CONTROLLED.OPEN' : 'CONTROLLED.CLOSE' })
    },
    value: function (val) {
      const self = this as WeappMultiselectInternal
      if (val == null) return
      const next = Array.isArray(val) ? val.map((item) => String(item)) : []
      const current = Array.isArray(self.data.selected) ? self.data.selected.map((item) => String(item)) : []
      if (next.join('|') === current.join('|')) return
      self.data.api.setValue?.(next)
    },
    items: function (items) {
      const self = this as WeappMultiselectInternal
      if (self._service) {
        self._collection = createCollection({
          items: items as SelectItemRecord[],
          itemLabelKey: self.properties.itemLabelKey,
          itemValueKey: self.properties.itemValueKey,
          factory: selectCollection,
        })
        self._service.setContext({ collection: self._collection })
      }
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
      const self = this as WeappMultiselectInternal
      const next = commitControl(self, self.data.opened ? 'close' : 'open')
      if (next.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: self.properties.open !== true })
        return
      }
      self.data.api.setOpen?.(!self.data.opened)
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappMultiselectInternal
      const value = controlEventValue(e) || String(e.mark?.value || '')
      const next = commitControl(self, 'select', value)
      const key = self.properties.itemValueKey || 'value'
      const record = (self.properties.items ?? []).find(
        (item) => String((item as { [key: string]: unknown })?.[key] ?? item) === value
      ) as { disabled?: boolean; disable?: boolean } | undefined
      if (!value || next.disabled || record?.disabled || record?.disable || !self._collection?.find?.(value)) return
      if (self.properties.value != null) {
        const current = Array.isArray(self.data.selected) ? self.data.selected.map((item) => String(item)) : []
        const requested = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value]
        this.triggerEvent('change', { value: requested })
        return
      }
      self.data.api.selectValue?.(value)
    },
    onBackdropTap() {
      const self = this as WeappMultiselectInternal
      if (self.properties.disabled) return
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
    },
    onConfirmTap() {
      const self = this as WeappMultiselectInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
      this.triggerEvent('confirm', { value: self.data.api.value ?? [] })
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
      if (key !== 'Enter' && key !== ' ') return
      this.onItemTap(event)
    },
    onCloseKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onBackdropTap()
    },
    onConfirmKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onConfirmTap()
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const open = this.data.opened === true
      const items = this.properties.items || []
      if (open && (key === 'Home' || key === 'End')) {
        const enabled: number[] = []
        items.forEach((item: { disabled?: boolean; disable?: boolean }, index: number) => {
          if (!item?.disabled && !item?.disable) enabled.push(index)
        })
        if (!enabled.length) return
        this.setData({ highlight: key === 'Home' ? enabled[0] : enabled[enabled.length - 1] })
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
        this.setData({ highlight: this.highlightIndex() })
        this.onTriggerTap()
        return
      }
      if (!open) return
      if (key === 'Escape') {
        this.onBackdropTap()
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        this.setData({ highlight: next.index })
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
