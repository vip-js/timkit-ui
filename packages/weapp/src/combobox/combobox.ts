// @ts-nocheck
import { comboboxCollection } from '@timui/core'

import { emitTimEvent } from '../utils'
import { createCollection, createScopedMachineId } from '../utils/collection'
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
    value: { type: Array, value: [] }, // Combobox value is array
    inputParams: { type: Object, value: {} }, // Pass to input
    placeholder: { type: String, value: 'Select an item' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    invalid: { type: Boolean, value: false },
    extClass: { type: String, value: '' },

    // Mobile specific
    label: { type: String, value: '' },
  },

  data: {
    api: {} as WeappComboboxApi,
    displayValue: '', // Computed label for the trigger input
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

      const { service, cleanup, send } = setupComboboxMachine(this, {
        id: this.properties.id || createScopedMachineId('combobox'),
        collection: self._collection,
        value: this.properties.value,
        name: this.properties.name,
        disabled: this.properties.disabled,
        readOnly: this.properties.readOnly,
        onValueChange: (details) => {
          emitTimEvent(this, 'change', 'change', this.properties.id || 'combobox', {
            value: details.value,
          })
        },
      })

      self._service = service
      self._cleanup = cleanup
      self._send = send
    },
    detached() {
      const self = this as WeappComboboxInternal
      self._cleanup?.()
    },
  },

  observers: {
    state: function (state) {
      const self = this as WeappComboboxInternal
      if (!state || !self._send) return
      const api = connectComboboxMachine(state, self._send)
      this.setData({ api })
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
    },
  },

  methods: {
    onTriggerTap() {
      const self = this as WeappComboboxInternal
      self.data.api.triggerProps?.onClick?.()
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappComboboxInternal
      const value = String(e.mark?.value || '')
      const item = self._collection.find(value)
      if (item && self.data.api.selectValue) {
        self.data.api.selectValue(value)
        self.data.api.setOpen?.(false)
      }
    },
    onBackdropTap() {
      const self = this as WeappComboboxInternal
      self.data.api.setOpen?.(false)
    },
  },
})
