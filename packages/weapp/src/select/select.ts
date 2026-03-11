// @ts-nocheck — WeApp Component API's `this` context is structurally incompatible with
// the custom WeappSelectInternal interface; this is a known limitation of the WeApp SDK typings.
import { selectCollection } from '@timui/core'

import { emitTimEvent } from '../utils'
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
    value: { type: Array, value: [] },
    name: { type: String, value: '' },
    placeholder: { type: String, value: 'Select an item' },
    disabled: { type: Boolean, value: false },
    label: { type: String, value: '' },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappSelectApi,
    className: '',
  },

  lifetimes: {
    attached() {
      const self = this as WeappSelectInternal
      this.setData({ className: this.properties.extClass })
      self._collection = createCollection({
        items: this.properties.items,
        itemLabelKey: self.properties.itemLabelKey,
        itemValueKey: self.properties.itemValueKey,
        factory: selectCollection,
      })

      const { service, cleanup, send } = setupSelectMachine(this, {
        id: this.properties.id || createScopedMachineId('select'),
        collection: self._collection,
        value: this.properties.value,
        name: this.properties.name,
        disabled: this.properties.disabled,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'select', {
            value: details.value,
          })
        },
      })

      self._service = service
      self._cleanup = cleanup
      self._send = send
    },
    detached() {
      const self = this as WeappSelectInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappSelectInternal
      if (!state || !self._send) return
      const api = connectSelectMachine(state, self._send)
      this.setData({ api })
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
    value: function (val) {
      const self = this as WeappSelectInternal
      if (self._service) {
        self._service.setContext({ value: val as Record<string, object> })
      }
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappSelectInternal
      self.data.api.triggerProps?.onClick?.()
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappSelectInternal
      const value = String(e.mark?.value || '')
      const item = self._collection.find(value)
      if (item && self.data.api.selectValue) {
        self.data.api.selectValue(value)
        self.data.api.setOpen?.(false)
      }
    },
    onBackdropTap() {
      const self = this as WeappSelectInternal
      self.data.api.setOpen?.(false)
    },
  },
})
