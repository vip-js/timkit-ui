import { createControl, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl, controlEventValue } from '../utils/control'
import { setupToggleGroupMachine } from './use-toggle-group'

type WeappToggleGroupApi = {
  value?: string[]
  setValue?: (value: string[]) => void
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type ToggleGroupTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
      disabled?: boolean | string
      disable?: boolean | string
    }
  }
}

type WeappToggleGroupInternal =
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> & {
    _service?: WeappService
    _cleanup?: () => void
    _send?: (event: object) => void
    _connect?: (state: object, send: (event: object) => void) => WeappToggleGroupApi
    data: {
      api: WeappToggleGroupApi
      selected: string[]
      focusValue: string
      control?: ControlState
    }
    properties: {
      value: string[]
      multiple: boolean
      disabled: boolean
      loop: boolean
      id: string
      extClass: string
    }
  }

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  relations: {
    '../toggle-group-item/toggle-group-item': {
      type: 'descendant',
      linked() {
        ;(this as WeappToggleGroupInternal).syncItems()
      },
      linkChanged() {
        ;(this as WeappToggleGroupInternal).syncItems()
      },
      unlinked() {
        ;(this as WeappToggleGroupInternal).syncItems()
      },
    },
  },

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    multiple: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loop: { type: Boolean, value: true },
    id: { type: String, value: 'toggle-group' },
    extClass: { type: String, value: '' },
    'aria-label': { type: String, value: '' },
  },

  data: {
    api: {} as WeappToggleGroupApi,
    className: '',
    selected: [] as string[],
    itemStatus: '',
    focusValue: '',
    ariaLabel: '',
    control: createControl() as ControlState,
  },

  lifetimes: {
    attached() {
      const self = this as WeappToggleGroupInternal
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const initial =
        source == null || source === '' ? [] : Array.isArray(source) ? source : [String(source)]
      const { service, start, send, connect } = setupToggleGroupMachine(this, {
        id: this.properties.id,
        value: initial,
        multiple: this.properties.multiple,
        disabled: this.properties.disabled,
        loop: this.properties.loop,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'toggle-group', {
            value: details.value,
          })
        },
      })

      self._service = service as WeappService
      self._send = send as (event: object) => void
      self._connect = connect
      self._cleanup = start()
      this.setData({ ariaLabel: String(this.properties['aria-label'] || '') })
    },
    detached() {
      const self = this as WeappToggleGroupInternal
      self._cleanup?.()
    },
  },

  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    state: function (state) {
      const self = this as WeappToggleGroupInternal
      if (!state || !self._send || !self._connect) return
      let api = self.data.api
      try {
        api = self._connect(state, self._send)
      } catch {
        api = self.data.api
      }
      this.setData({
        api,
        selected: api.value ?? [],
        itemStatus: this.itemText(api.value ?? []),
        className: this.properties.extClass,
      })
      self.syncItems()
    },
    disabled() {
      ;(this as WeappToggleGroupInternal).syncItems()
    },
    value(next: unknown) {
      const self = this as WeappToggleGroupInternal
      if (next == null) return
      const incoming = Array.isArray(next)
        ? next.map((item) => String(item))
        : next == null || next === ''
          ? []
          : [String(next)]
      const current = Array.isArray(self.data.selected) ? self.data.selected.map(String) : []
      if (incoming.join('\0') === current.join('\0')) return
      self.data.api.setValue?.(incoming)
    },
  },

  methods: {
    itemText(selected: string[]) {
      const values = this.itemNodes()
        .map((node) => String(node.properties?.value || ''))
        .filter(Boolean)
      const picked = selected.filter(Boolean)
      if (picked.length === 0 || values.length === 0) return ''
      if (picked.length === 1) {
        const index = values.indexOf(picked[0] ?? '')
        return index < 0 ? '' : `Item ${index + 1} of ${values.length}`
      }
      return `${picked.length} items pressed`
    },
    itemNodes() {
      const self = this as WeappToggleGroupInternal
      if (typeof self.getRelationNodes !== 'function') return []
      return self.getRelationNodes('../toggle-group-item/toggle-group-item') as Array<{
        properties?: { value?: string; disabled?: boolean }
        setData?: (data: { pressed: boolean; tabbable: boolean; itemRole: string; groupDisabled: boolean }) => void
      }>
    },
    syncItems() {
      const self = this as WeappToggleGroupInternal
      const selected = Array.isArray(self.data.selected) ? self.data.selected.map(String) : []
      const nodes = self.itemNodes()
      const groupDisabled = !!self.properties.disabled
      const enabled = nodes.filter((node) => !node.properties?.disabled && !groupDisabled)
      const current = String(self.data.focusValue || '')
      const tabValue = enabled.some((node) => String(node.properties?.value || '') === current)
        ? current
        : String(enabled[0]?.properties?.value || '')
      const itemRole = self.properties.multiple ? 'button' : 'radio'
      for (const node of nodes) {
        const value = String(node.properties?.value || '')
        node.setData?.({
          pressed: selected.includes(value),
          tabbable: Boolean(tabValue) && value === tabValue,
          itemRole,
          groupDisabled,
        })
      }
    },
    onItemKey(event?: { value?: string; detail?: { key?: string } }) {
      const self = this as WeappToggleGroupInternal
      if (self.properties.disabled) return
      const key = String(event?.detail?.key || '')
      if (key !== 'ArrowRight' && key !== 'ArrowLeft') return
      const enabled = self.itemNodes().filter((node) => !node.properties?.disabled)
      const values = enabled.map((node) => String(node.properties?.value || '')).filter(Boolean)
      if (!values.length) return
      const from = String(event?.value || self.data.focusValue || values[0])
      let index = values.indexOf(from)
      if (index < 0) index = 0
      const delta = key === 'ArrowRight' ? 1 : -1
      let next = index + delta
      if (next < 0) next = self.properties.loop ? values.length - 1 : 0
      if (next >= values.length) next = self.properties.loop ? 0 : values.length - 1
      this.setData({ focusValue: values[next] })
      self.syncItems()
    },
    onItemTap(e: ToggleGroupTapEvent) {
      const self = this as WeappToggleGroupInternal
      const dataset = e.currentTarget?.dataset
      if (dataset?.disabled === true || dataset?.disabled === 'true' || dataset?.disable) return
      const value = controlEventValue(e)
      const next = commitControl(self, 'select', value)
      if (!value || next.disabled) return
      const currentValue = self.data.selected || []
      const requested = this.properties.multiple
        ? currentValue.includes(value)
          ? currentValue.filter((item) => item !== value)
          : [...currentValue, value]
        : currentValue.length === 1 && currentValue[0] === value
          ? []
          : [value]
      if (self.properties.value != null) {
        this.triggerEvent('change', { value: requested })
        return
      }
      if (!self.data.api.setValue) return
      if (this.properties.multiple) {
        const newValue = currentValue.includes(value)
          ? currentValue.filter((item) => item !== value)
          : [...currentValue, value]
        self.data.api.setValue(newValue)
        return
      }
      self.data.api.setValue(currentValue.length === 1 && currentValue[0] === value ? [] : [value])
    },
  },
})
