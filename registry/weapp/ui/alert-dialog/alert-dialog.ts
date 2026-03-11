import * as dialog from '@zag-js/dialog'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../alert-dialog-trigger/alert-dialog-trigger': { type: 'descendant' },
    '../alert-dialog-content/alert-dialog-content': { type: 'descendant' },
    '../alert-dialog-overlay/alert-dialog-overlay': { type: 'descendant' },
    '../alert-dialog-title/alert-dialog-title': { type: 'descendant' },
    '../alert-dialog-description/alert-dialog-description': { type: 'descendant' },
    '../alert-dialog-action/alert-dialog-action': { type: 'descendant' },
    '../alert-dialog-cancel/alert-dialog-cancel': { type: 'descendant' },
  },
  properties: {
    open: { type: Boolean, value: false },
    defaultOpen: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, dialog.machine, {
      id: this.properties.id || `alert-dialog-${Math.random()}`,
      open: this.properties.open,
      defaultOpen: this.properties.defaultOpen,
      role: 'alertdialog',
      onOpenChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:open', details.open)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = dialog.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../alert-dialog-trigger/alert-dialog-trigger')
      updateChild('../alert-dialog-content/alert-dialog-content')
      updateChild('../alert-dialog-overlay/alert-dialog-overlay')
      updateChild('../alert-dialog-title/alert-dialog-title')
      updateChild('../alert-dialog-description/alert-dialog-description')
      updateChild('../alert-dialog-action/alert-dialog-action')
      updateChild('../alert-dialog-cancel/alert-dialog-cancel')
    },
  },
})
