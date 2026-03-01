import { useMachine, normalizeProps } from '../../utils/machine'
import * as hoverCard from '@zag-js/hover-card'

Component({
    relations: {
        '../hover-card-trigger/hover-card-trigger': { type: 'descendant' },
        '../hover-card-content/hover-card-content': { type: 'descendant' }
    },
    properties: {
        openDelay: { type: Number, value: 700 },
        closeDelay: { type: Number, value: 300 },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, hoverCard.machine, {
            id: this.properties.id || `hover-card-${Math.random()}`,
            openDelay: this.properties.openDelay,
            closeDelay: this.properties.closeDelay,
            onOpenChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:open', details.open)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = hoverCard.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../hover-card-trigger/hover-card-trigger')
            updateChild('../hover-card-content/hover-card-content')
        }
    }
})
