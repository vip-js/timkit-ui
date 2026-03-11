import * as combobox from '@zag-js/combobox'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../combobox-input/combobox-input': { type: 'descendant' },
    '../combobox-trigger/combobox-trigger': { type: 'descendant' },
    '../combobox-content/combobox-content': { type: 'descendant' },
    '../combobox-item/combobox-item': { type: 'descendant' },
    '../combobox-control/combobox-control': { type: 'descendant' },
    '../combobox-item-group/combobox-item-group': { type: 'descendant' },
    '../combobox-item-group-label/combobox-item-group-label': { type: 'descendant' },
  },
  properties: {
    items: { type: Array, value: [] },
    value: { type: Array, value: [] }, // Combobox can be multiple
    defaultValue: { type: Array, value: [] },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    multiple: { type: Boolean, value: false },
    inputBehavior: { type: String, value: 'autohighlight' }, // autohighlight, autocomplete, none
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  observers: {
    items: function (newItems) {
      if (this.service) {
        const collection = combobox.collection({
          items: newItems,
          itemToString: (item) => item.label,
          itemToValue: (item) => item.value,
        })
        this.service.send({ type: 'COLLECTION.SET', value: collection })
      }
    },
  },

  attached() {
    const collection = combobox.collection({
      items: this.properties.items,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    })

    this.service = useMachine(this, combobox.machine, {
      id: this.properties.id || `combobox-${Math.random()}`,
      collection,
      value: this.properties.value,
      defaultValue: this.properties.defaultValue,
      disabled: this.properties.disabled,
      readOnly: this.properties.readOnly,
      multiple: this.properties.multiple,
      inputBehavior: (this.properties.inputBehavior as any) || 'autohighlight',
      onOpenChange: (details) => {
        this.triggerEvent('openChange', details)
      },
      onValueChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:value', details.value)
      },
      onInputValueChange: (details) => {
        this.triggerEvent('input', details)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = combobox.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../combobox-input/combobox-input')
      updateChild('../combobox-trigger/combobox-trigger')
      updateChild('../combobox-content/combobox-content')
      updateChild('../combobox-item/combobox-item')
      updateChild('../combobox-control/combobox-control')
      updateChild('../combobox-item-group/combobox-item-group')
      updateChild('../combobox-item-group-label/combobox-item-group-label')
    },
  },
})
