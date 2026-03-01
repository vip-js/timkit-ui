import { useMachine, normalizeProps } from '../../utils/machine'
import * as avatar from '@zag-js/avatar'

Component({
    relations: {
        '../avatar-image/avatar-image': { type: 'descendant' },
        '../avatar-fallback/avatar-fallback': { type: 'descendant' }
    },
    properties: {
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, avatar.machine, {
            id: this.properties.id || `avatar-${Math.random()}`,
            onStatusChange: (details) => {
                this.triggerEvent('status-change', details)
                // Re-render children potentially
                this.updateApi(this.service.state, this.service.send)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = avatar.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }
            updateChild('../avatar-image/avatar-image')
            updateChild('../avatar-fallback/avatar-fallback')
        }
    }
})
