import * as accordion from '@zag-js/accordion'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  options: {
    multipleSlots: true,
  },
  relations: {
    '../accordion-item/accordion-item': {
      type: 'descendant',
      linked(target) {
        // We might need to register item or force update
        if (this.data.api && this.data.api.value) {
          target.updateFromParent(this.data.api)
        }
      },
    },
  },
  properties: {
    value: { type: Array, value: [] },
    collapsible: { type: Boolean, value: false },
    multiple: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, accordion.machine, {
      id: this.properties.id || `accordion-${Math.random()}`,
      value: this.properties.value,
      collapsible: this.properties.collapsible,
      multiple: this.properties.multiple,
      disabled: this.properties.disabled,
      onValueChange: (details) => {
        this.triggerEvent('change', details)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = accordion.connect(state, send, normalizeProps)
      this.setData({ api })

      // Notify children
      const nodes = this.getRelationNodes('../accordion-item/accordion-item')
      nodes.forEach((node) => {
        node.updateFromParent(api)
      })
    },
  },
})
