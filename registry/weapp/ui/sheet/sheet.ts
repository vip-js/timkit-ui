import { useMachine, normalizeProps } from '../../utils/machine'
import * as dialog from '@zag-js/dialog'

Component({
    relations: {
        '../sheet-trigger/sheet-trigger': { type: 'descendant' },
        '../sheet-content/sheet-content': { type: 'descendant' },
        '../sheet-overlay/sheet-overlay': { type: 'descendant' },
        '../sheet-title/sheet-title': { type: 'descendant' },
        '../sheet-description/sheet-description': { type: 'descendant' },
        '../sheet-close/sheet-close': { type: 'descendant' }
    },
    properties: {
        open: { type: Boolean, value: false },
        defaultOpen: { type: Boolean, value: false },
        side: { type: String, value: 'right' }, // Sheet specific prop
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, dialog.machine, {
            id: this.properties.id || `sheet-${Math.random()}`,
            open: this.properties.open,
            defaultOpen: this.properties.defaultOpen,
            // Sheet uses dialog machine but styling handles 'side'
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

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../sheet-trigger/sheet-trigger')
            updateChild('../sheet-content/sheet-content')
            updateChild('../sheet-overlay/sheet-overlay')
            updateChild('../sheet-title/sheet-title')
            updateChild('../sheet-description/sheet-description')
            updateChild('../sheet-close/sheet-close')
        }
    }
})
