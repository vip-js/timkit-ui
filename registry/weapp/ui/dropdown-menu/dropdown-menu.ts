import { useMachine, normalizeProps } from '../../utils/machine'
import * as menu from '@zag-js/menu'

Component({
    relations: {
        '../dropdown-menu-trigger/dropdown-menu-trigger': { type: 'descendant' },
        '../dropdown-menu-content/dropdown-menu-content': { type: 'descendant' },
        '../dropdown-menu-item/dropdown-menu-item': { type: 'descendant' },
        '../dropdown-menu-separator/dropdown-menu-separator': { type: 'descendant' },
        '../dropdown-menu-label/dropdown-menu-label': { type: 'descendant' }
    },
    properties: {
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, menu.machine, {
            id: this.properties.id || `menu-${Math.random()}`,
            onOpenChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:open', details.open)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = menu.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../dropdown-menu-trigger/dropdown-menu-trigger')
            updateChild('../dropdown-menu-content/dropdown-menu-content')
            updateChild('../dropdown-menu-item/dropdown-menu-item')
            updateChild('../dropdown-menu-separator/dropdown-menu-separator')
            updateChild('../dropdown-menu-label/dropdown-menu-label')
        }
    }
})
