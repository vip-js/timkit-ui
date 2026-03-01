import { useMachine, normalizeProps } from '../../utils/machine'
import * as tabs from '@zag-js/tabs'

Component({
    relations: {
        '../tabs-list/tabs-list': { type: 'descendant' },
        '../tabs-trigger/tabs-trigger': { type: 'descendant' },
        '../tabs-content/tabs-content': { type: 'descendant' }
    },
    properties: {
        value: { type: String, value: '' },
        defaultValue: { type: String, value: '' },
        orientation: { type: String, value: 'horizontal' },
        activationMode: { type: String, value: 'automatic' },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, tabs.machine, {
            id: this.properties.id || `tabs-${Math.random()}`,
            value: this.properties.value,
            defaultValue: this.properties.defaultValue,
            orientation: this.properties.orientation || "horizontal",
            activationMode: this.properties.activationMode || "automatic",
            onValueChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:value', details.value)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = tabs.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../tabs-list/tabs-list')
            updateChild('../tabs-trigger/tabs-trigger')
            updateChild('../tabs-content/tabs-content')
        }
    }
})
