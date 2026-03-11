import * as select from '@zag-js/select'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../select-trigger/select-trigger': { type: 'descendant' },
    '../select-content/select-content': { type: 'descendant' },
    '../select-item/select-item': { type: 'descendant' },
    '../select-label/select-label': { type: 'descendant' },
    '../select-item-group/select-item-group': { type: 'descendant' },
    '../select-item-group-label/select-item-group-label': { type: 'descendant' },
  },
  properties: {
    items: { type: Array, value: [] },
    value: { type: Array, value: [] },
    defaultValue: { type: Array, value: [] },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    multiple: { type: Boolean, value: false },
    id: { type: String, value: '' },
    label: { type: String, value: 'Label' }, // Simple label mapping
  },

  data: {
    api: {} as any,
  },

  observers: {
    items: function (newItems) {
      if (this.service) {
        const collection = select.collection({
          items: newItems,
          itemToString: (item) => item.label,
          itemToValue: (item) => item.value,
        })
        this.service.send({ type: 'COLLECTION.SET', value: collection })
      }
    },
    value: function (newVal) {
      if (this.service && newVal !== this.data.api.value) {
        // Sync value if controlled? Zag usually handles this via api.setValue?
        // Or service.send({ type: 'VALUE.SET', value: newVal })
      }
    },
  },

  attached() {
    const collection = select.collection({
      items: this.properties.items,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    })

    this.service = useMachine(this, select.machine, {
      id: this.properties.id || `select-${Math.random()}`,
      collection,
      value: this.properties.value,
      defaultValue: this.properties.defaultValue,
      disabled: this.properties.disabled,
      readOnly: this.properties.readOnly,
      multiple: this.properties.multiple,
      onOpenChange: (details) => {
        this.triggerEvent('openChange', details)
      },
      onValueChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:value', details.value)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = select.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../select-trigger/select-trigger')
      updateChild('../select-content/select-content')
      updateChild('../select-item/select-item')
      updateChild('../select-label/select-label')
      updateChild('../select-item-group/select-item-group')
      updateChild('../select-item-group-label/select-item-group-label')
    },
  },
})
