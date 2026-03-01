import { setupMultiselectMachine } from './use-multiselect'
import { selectCollection } from '@timui/core'
import { createCollection, createScopedMachineId } from '../utils/collection'

type SelectItemRecord = Record<string, object>
type SelectCollection = ReturnType<typeof selectCollection<SelectItemRecord>>
type MachineSend = (event: string | { type: string; [key: string]: object }) => void

type WeappMultiselectApi = {
  triggerProps?: { onClick?: () => void }
  selectValue?: (value: string) => void
  setOpen?: (open: boolean) => void
  value?: string[]
}

type WeappService = {
  setContext: (context: Record<string, object>) => void
}

type WeappMultiselectInternal = WechatMiniprogram.Component.InstanceMethods<Record<string, object>> & {
  _collection?: SelectCollection
  _service?: WeappService
  _cleanup?: () => void
  _send?: MachineSend
  data: {
    api: WeappMultiselectApi
  }
  properties: {
    items: SelectItemRecord[]
    itemLabelKey: string
    itemValueKey: string
    value: string[]
    name: string
    disabled: boolean
    multiple: boolean
    extClass: string
  }
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  properties: {
    items: { type: Array, value: [] },
    itemLabelKey: { type: String, value: 'label' },
    itemValueKey: { type: String, value: 'value' },
    value: { type: Array, value: [] },
    name: { type: String, value: '' },
    placeholder: { type: String, value: '请选择' },
    disabled: { type: Boolean, value: false },
    label: { type: String, value: '' },
    multiple: { type: Boolean, value: true },
    extClass: { type: String, value: '' },
  },

  data: {
    api: {} as WeappMultiselectApi,
    className: '',
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

      const { service, cleanup, send } = setupMultiselectMachine(this, {
        id: createScopedMachineId('multiselect'),
        collection: self._collection,
        value: this.properties.value,
        name: this.properties.name,
        disabled: this.properties.disabled,
        multiple: this.properties.multiple,
        onValueChange: (details) => {
          this.triggerEvent('change', details)
        }
      })

      self._service = service as WeappService
      self._cleanup = cleanup
      self._send = send
    },
    detached() {
      const self = this as WeappMultiselectInternal
      self._cleanup?.()
    },
  },

  observers: {
    'state': function (state) {
      const self = this as WeappMultiselectInternal
      if (!state || !self._send) return
      const { connect } = setupMultiselectMachine(this, { collection: self._collection })
      const api = connect(state, self._send) as WeappMultiselectApi
      this.setData({ api })
    },
    'items': function (items) {
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
    onTriggerTap() {
      const self = this as WeappMultiselectInternal
      self.data.api.triggerProps?.onClick?.()
    },
    onItemTap(e: WechatMiniprogram.BaseEvent) {
      const self = this as WeappMultiselectInternal
      const value = String(e.mark?.value || '')
      const item = self._collection?.find(value)
      if (item && self.data.api.selectValue) {
        self.data.api.selectValue(value)
      }
    },
    onBackdropTap() {
      const self = this as WeappMultiselectInternal
      self.data.api.setOpen?.(false)
    },
    onConfirmTap() {
      const self = this as WeappMultiselectInternal
      self.data.api.setOpen?.(false)
      this.triggerEvent('confirm', { value: self.data.api.value ?? [] })
    },
  },
})
