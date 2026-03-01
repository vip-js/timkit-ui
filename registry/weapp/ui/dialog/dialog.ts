import { useMachine, normalizeProps } from '../../utils/machine'
import * as dialog from '@zag-js/dialog'

Component({
    relations: {
        '../dialog-trigger/dialog-trigger': { type: 'descendant' },
        '../dialog-content/dialog-content': { type: 'descendant' },
        '../dialog-overlay/dialog-overlay': { type: 'descendant' },
        '../dialog-title/dialog-title': { type: 'descendant' },
        '../dialog-description/dialog-description': { type: 'descendant' },
        '../dialog-close/dialog-close': { type: 'descendant' }
    },
    properties: {
        open: { type: Boolean, value: false },
        defaultOpen: { type: Boolean, value: false },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, dialog.machine, {
            id: this.properties.id || `dialog-${Math.random()}`,
            open: this.properties.open,
            defaultOpen: this.properties.defaultOpen,
            onOpenChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:open', details.open)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = dialog.connect(state, send, normalizeProps)
            this.setData({ api })

            // Update all children
            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../dialog-trigger/dialog-trigger')
            updateChild('../dialog-content/dialog-content')
            updateChild('../dialog-overlay/dialog-overlay')
            updateChild('../dialog-title/dialog-title')
            updateChild('../dialog-description/dialog-description')
            updateChild('../dialog-close/dialog-close')
        }
    }
})
