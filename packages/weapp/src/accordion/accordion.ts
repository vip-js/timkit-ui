import { createControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl, controlEventValue } from '../utils/control'
import { publishMachine } from '../utils/machine'
import { setupAccordionMachine, toArray } from './use-accordion'

type MachineEvent =
  | string
  | {
      type: string
      [key: string]: string | number | boolean | string[] | number[] | null | undefined
    }

type WeappAccordionApi = {
  value?: string[]
  setValue?: (value: string[]) => void
}

type WeappService = {
  setContext: (context: {
    value?: string[]
    multiple?: boolean
    collapsible?: boolean
    disabled?: boolean
  }) => void
}

type ItemTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
    }
  }
}

type WeappAccordionInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: MachineEvent) => void
    _connect?: (
      state: { value?: string[] },
      send: (event: MachineEvent) => void
    ) => WeappAccordionApi
    data: {
      api: WeappAccordionApi
      value?: string[]
      focusedValue?: string
      control?: ControlState
    }
    properties: {
      value: string[] | string | null
      defaultValue?: string[] | string | null
      type: string
      multiple: boolean
      collapsible: boolean
      disabled: boolean
      id: string
      extClass: string
      items: Array<{ value?: string; disabled?: boolean; disable?: boolean }>
    }
  }

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    type: { type: String, value: 'single' },
    multiple: { type: Boolean, value: false },
    collapsible: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: 'accordion' },
    extClass: { type: String, value: '' },
    items: { type: Array, value: [] },
  },

  data: {
    api: {} as WeappAccordionApi,
    value: [] as string[],
    openMap: {} as Record<string, boolean>,
    openStatus: '',
    focusedValue: '',
    className: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappAccordionInternal
      const multiple = this.properties.type === 'multiple' || this.properties.multiple
      const passed = this.properties.value
      const initial = passed == null ? this.properties.defaultValue : passed
      const { service, start, send, connect } = setupAccordionMachine(this, {
        id: this.properties.id,
        value: toArray(initial),
        multiple,
        collapsible: this.properties.collapsible,
        disabled: this.properties.disabled,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'accordion', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: MachineEvent) => void
      self._connect = connect
      self._cleanup = start()
      publishMachine(this)
    },
    detached() {
      const self = this as WeappAccordionInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappAccordionInternal
      if (!state || !self._send || !self._connect) return
      const api = self._connect(state, self._send) as WeappAccordionApi
      const value = api.value ?? []
      const openMap: Record<string, boolean> = {}
      for (const item of value) openMap[item] = true
      this.setData({
        api,
        value,
        openMap,
        openStatus: this.openText(value.map(String)),
        className: this.properties.extClass,
      })
    },
    value(next: unknown) {
      const self = this as WeappAccordionInternal
      if (next == null) return
      const incoming = Array.isArray(next) ? next.map((item) => String(item)) : []
      const current = Array.isArray(self.data.value) ? self.data.value.map(String) : []
      if (incoming.join('\0') === current.join('\0')) return
      self.data.api.setValue?.(incoming)
    },
  },

  methods: {
    openText(value: string[]) {
      const open = value.filter(Boolean)
      if (open.length === 0) return ''
      const items = this.properties.items ?? []
      if (open.length === 1) {
        const index = items.findIndex((item) => item.value === open[0])
        return index < 0 ? '' : `Item ${index + 1} of ${items.length}`
      }
      return `${open.length} items open`
    },
    onItemTap(e: ItemTapEvent) {
      const self = this as WeappAccordionInternal
      const value = controlEventValue(e)
      const dataset = e.currentTarget?.dataset as { disabled?: boolean | string; disable?: boolean | string }
      if (dataset?.disabled === true || dataset?.disabled === 'true' || dataset?.disable) return
      const record = (self.properties.items ?? []).find((item) => item.value === value)
      if (record?.disabled || record?.disable) return
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled) return
      if (self.properties.value != null) {
        const current = Array.isArray(self.data.value) ? self.data.value.map(String) : []
        const multiple = self.properties.type === 'multiple' || self.properties.multiple
        const requested =
          multiple
            ? current.includes(value)
              ? current.filter((item) => item !== value)
              : [...current, value]
            : self.properties.collapsible !== false && current.length === 1 && current[0] === value
              ? []
              : [value]
        this.triggerEvent('change', { value: requested })
        return
      }
      self._send?.({ type: 'TRIGGER.FOCUS', value })
      self._send?.({ type: 'TRIGGER.CLICK', value })
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      const self = this as WeappAccordionInternal
      if (self.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const items = (self.properties.items ?? []).filter((item) => item.value && !item.disabled && !item.disable)
      if (!items.length) return
      const open = Array.isArray(self.data.value) ? self.data.value.map(String) : []
      const current = String(self.data.focusedValue || open[0] || items[0]?.value || '')
      let index = items.findIndex((item) => item.value === current)
      if (index < 0) index = 0
      const next = reduceWidgetKey(
        'accordion',
        { open: false, index, count: items.length, checked: open.includes(current), value: 0, min: 0, max: 0, step: 1 },
        key
      )
      if (!next.handled) return
      const value = String(items[key === ' ' || key === 'Enter' ? index : next.index]?.value ?? '')
      if (!value) return
      if (key === ' ' || key === 'Enter') {
        this.onItemTap({ mark: { value }, currentTarget: { dataset: { value } } })
        return
      }
      if (value === current) return
      this.setData({ focusedValue: value })
    },
  },
})
