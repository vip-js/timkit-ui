import * as collapsible from '@zag-js/collapsible'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../collapsible-trigger/collapsible-trigger': { type: 'descendant' },
    '../collapsible-content/collapsible-content': { type: 'descendant' },
  },
  properties: {
    open: { type: Boolean, value: false },
    defaultOpen: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, collapsible.machine, {
      id: this.properties.id || `collapsible-${Math.random()}`,
      open: this.properties.open,
      defaultOpen: this.properties.defaultOpen,
      disabled: this.properties.disabled,
      onOpenChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:open', details.open)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = collapsible.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }
      updateChild('../collapsible-trigger/collapsible-trigger')
      updateChild('../collapsible-content/collapsible-content')
    },
  },
})
