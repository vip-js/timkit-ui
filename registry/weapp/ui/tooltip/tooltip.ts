import * as tooltip from '@zag-js/tooltip'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../tooltip-trigger/tooltip-trigger': { type: 'descendant' },
    '../tooltip-content/tooltip-content': { type: 'descendant' },
  },
  properties: {
    openDelay: { type: Number, value: 500 },
    closeDelay: { type: Number, value: 250 },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, tooltip.machine, {
      id: this.properties.id || `tooltip-${Math.random()}`,
      openDelay: this.properties.openDelay,
      closeDelay: this.properties.closeDelay,
      onOpenChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:open', details.open)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = tooltip.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../tooltip-trigger/tooltip-trigger')
      updateChild('../tooltip-content/tooltip-content')
    },
  },
})
