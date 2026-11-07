// @ts-nocheck
import { createControl, reduceWidgetKey, type ControlState } from '@timui/core'

import { emitTimEvent } from '../utils'
import { commitControl, controlEventValue } from '../utils/control'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'
import {
  connectDropdownMenuMachine,
  setupDropdownMenuMachine,
  type WeappDropdownMenuApi,
  type WeappDropdownMenuService,
} from './use-dropdown-menu'
import { publishMachine } from '../utils/machine'

type MenuItemTapEvent = WechatMiniprogram.BaseEvent & {
  currentTarget: {
    dataset: {
      value?: string
    }
  }
}

type WeappDropdownMenuInternal = WechatMiniprogram.Component.InstanceMethods<{}> & {
  _service?: WeappDropdownMenuService
  _cleanup?: () => void
  _send?: (event: object) => void
  data: {
    api: WeappDropdownMenuApi
    control?: ControlState
  }
  properties: {
    open: boolean
    closeOnSelect: boolean
    id: string
    extClass: string
    disabled?: boolean
  }
}

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  relations: {
    '../dropdown-menu-item/dropdown-menu-item': {
      type: 'child',
    },
    '../dropdown-menu-radio-item/dropdown-menu-radio-item': {
      type: 'child',
    },
    '../dropdown-menu-checkbox-item/dropdown-menu-checkbox-item': {
      type: 'child',
    },
  },

  properties: {
    open: { type: null, value: null },
    defaultOpen: { type: null, value: null },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    closeOnSelect: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    ...createWeappBaseProps('dropdown-menu'),
  },

  data: {
    api: {} as WeappDropdownMenuApi,
    className: '',
    control: createControl() as ControlState,
    radioValue: '',
    opened: false,
    highlight: 0,
    itemStatus: '',
    typeaheadAnchor: false,
  },

  lifetimes: {
    attached() {
      const self = this as WeappDropdownMenuInternal
      const { service, cleanup, send } = setupDropdownMenuMachine(this, {
        id: this.properties.id,
        open: this.properties.open == null ? this.properties.defaultOpen === true : this.properties.open,
        closeOnSelect: this.properties.closeOnSelect,
        onOpenChange: (details) => {
          this.triggerEvent('change', details)
          emitTimEvent(
            this,
            'openchange',
            'dropdownMenu.openChange',
            this.properties.id || 'dropdown-menu',
            {
              open: details.open,
            }
          )
        },
        onSelect: (details) => {
          this.triggerEvent('select', details)
        },
      })

      self._service = service
      self._cleanup = cleanup
      self._send = send
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      if (source) this.setData({ radioValue: String(source) })
      publishMachine(this)
    },
    detached() {
      const self = this as WeappDropdownMenuInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappDropdownMenuInternal
      if (!state || !self._send) return
      const api = connectDropdownMenuMachine(state, self._send)
      this.setData({
        api,
        opened: Boolean(api.open),
        className: this.properties.extClass,
        itemStatus: api.open ? this.itemText(Number(this.data.highlight) || 0) : '',
      })
    },
    value(next: unknown) {
      if (next == null) return
      const value = String(next)
      this.setData({ radioValue: value })
      const nodes = (
        typeof this.getRelationNodes === 'function'
          ? this.getRelationNodes('../dropdown-menu-radio-item/dropdown-menu-radio-item')
          : []
      ) as Array<{ properties?: { value?: string }; setChecked?: (on: boolean) => void }>
      nodes.forEach((node) => node.setChecked?.(value !== '' && node.properties?.value === value))
    },
    open(val: boolean) {
      const self = this as WeappDropdownMenuInternal
      if (val == null || !self.data.api.setOpen || Boolean(val) === Boolean(self.data.opened)) return
      self.data.api.setOpen(Boolean(val))
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappDropdownMenuInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: !self.data.opened })
        return
      }
      const next = commitControl(self, 'open')
      if (!next.open) return
      const click = { defaultPrevented: false, stopPropagation() {}, preventDefault() {} }
      const api = self.data.api as WeappDropdownMenuApi & {
        getTriggerProps?: () => { onClick?: (event: typeof click) => void }
      }
      api.getTriggerProps?.().onClick?.(click)
      api.triggerProps?.onClick?.()
    },
    onItemTap(e: MenuItemTapEvent) {
      const self = this as WeappDropdownMenuInternal
      const value = controlEventValue(e)
      const next = commitControl(self, 'select', value)
      if (next.disabled || !value || !self.data.api.selectItem) return
      self.data.api.selectItem({ value })
    },
    selectRadio(value: string) {
      if (this.properties.disabled || !value) return
      this.triggerEvent('radioChange', { value })
      if (this.properties.value != null) return
      this.setData({ radioValue: value })
      const nodes = (
        typeof this.getRelationNodes === 'function'
          ? this.getRelationNodes('../dropdown-menu-radio-item/dropdown-menu-radio-item')
          : []
      ) as Array<{ properties?: { value?: string }; setChecked?: (on: boolean) => void }>
      nodes.forEach((node) => node.setChecked?.(node.properties?.value === value))
    },
    onBackdropTap() {
      const self = this as WeappDropdownMenuInternal
      if (self.properties.open != null) {
        this.triggerEvent('change', { open: false })
        return
      }
      self.data.api.setOpen?.(false)
    },
    close() {
      this.onBackdropTap()
    },
    registerItem(node: { properties?: { disabled?: boolean } }) {
      const items = this._items || []
      if (!items.includes(node)) items.push(node)
      this._items = items
    },
    unregisterItem(node: { properties?: { disabled?: boolean } }) {
      this._items = (this._items || []).filter((item: { properties?: { disabled?: boolean } }) => item !== node)
    },
    typeaheadIndex(currentIndex: number, key: string) {
      const items = this._items || []
      const letter = key.toLowerCase()
      if (!items.length) return -1
      const start = currentIndex < 0 ? 0 : currentIndex + 1
      for (let offset = 0; offset < items.length; offset += 1) {
        const index = (start + offset) % items.length
        if (currentIndex >= 0 && index === currentIndex) continue
        const item = items[index] as { properties?: { disabled?: boolean; label?: string; value?: string } } | undefined
        if (!item || item.properties?.disabled) continue
        const label = String(item.properties?.label || item.properties?.value || '')
        if (label.toLowerCase().startsWith(letter)) return index
      }
      return -1
    },
    itemText(index: number) {
      const count = (this._items || []).length
      if (count === 0 || index < 0 || index >= count) return ''
      return `Item ${index + 1} of ${count}`
    },
    paintHighlight(index: number) {
      const items = this._items || []
      this.setData({ highlight: index, typeaheadAnchor: true, itemStatus: this.itemText(index) })
      items.forEach((item: { setActive?: (on: boolean) => void }, itemIndex: number) => {
        item.setActive?.(itemIndex === index)
      })
    },
    enabledIndex(start: number, delta: number) {
      const items = this._items || []
      if (!items.length) return 0
      let index = start
      for (let step = 0; step < items.length; step += 1) {
        index = (index + delta + items.length) % items.length
        if (!items[index]?.properties?.disabled) return index
      }
      return start
    },
    activateHighlight() {
      const items = this._items || []
      const item = items[Number(this.data.highlight) || 0] as
        | { properties?: { disabled?: boolean }; activate?: () => void }
        | undefined
      if (!item || item.properties?.disabled) return
      item.activate?.()
    },
    onKey(event?: { detail?: { key?: string }; mark?: { key?: string } }) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const open = this.data.opened === true
      const items = this._items || []
      if (open && /^[a-z]$/i.test(key)) {
        const anchor = this.data.typeaheadAnchor === true ? Number(this.data.highlight) : -1
        const index = this.typeaheadIndex(anchor, key)
        if (index < 0) return
        this.paintHighlight(index)
        return
      }
      if (open && (key === 'Home' || key === 'End')) {
        const enabled: number[] = []
        items.forEach((item: { properties?: { disabled?: boolean } }, index: number) => {
          if (!item?.properties?.disabled) enabled.push(index)
        })
        if (!enabled.length) return
        this.paintHighlight(key === 'Home' ? enabled[0] : enabled[enabled.length - 1])
        return
      }
      const next = reduceWidgetKey(
        'menu',
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
        const first = items.findIndex((item: { properties?: { disabled?: boolean } }) => !item.properties?.disabled)
        this.paintHighlight(first >= 0 ? first : 0)
        this.onTriggerTap()
        return
      }
      if (!open) return
      if (key === 'Escape') {
        this.close()
        return
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        const delta = key === 'ArrowDown' ? 1 : -1
        const index = items[next.index]?.properties?.disabled ? this.enabledIndex(next.index, delta) : next.index
        this.paintHighlight(index)
        return
      }
      if (key === 'Enter') this.activateHighlight()
    },
  },
})
