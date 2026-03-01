import { useMachine, normalizeProps } from '../../utils/machine'
import * as popover from '@zag-js/popover'

Component({
    relations: {
        '../popover-trigger/popover-trigger': { type: 'descendant' },
        '../popover-content/popover-content': { type: 'descendant' },
        '../popover-close/popover-close': { type: 'descendant' },
        '../popover-anchor/popover-anchor': { type: 'descendant' }
    },
    properties: {
        id: { type: String, value: '' },
        open: { type: Boolean, value: false },
        defaultOpen: { type: Boolean, value: false },
        modal: { type: Boolean, value: false }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, popover.machine, {
            id: this.properties.id || `popover-${Math.random()}`,
            open: this.properties.open,
            defaultOpen: this.properties.defaultOpen,
            modal: this.properties.modal,
            onOpenChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:open', details.open)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = popover.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../popover-trigger/popover-trigger')
            updateChild('../popover-content/popover-content')
            updateChild('../popover-close/popover-close')
            updateChild('../popover-anchor/popover-anchor')
        }
    }
})
