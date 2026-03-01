import { useMachine, normalizeProps } from '../../utils/machine'
import * as toggleGroup from '@zag-js/toggle-group'

Component({
    relations: {
        '../toggle-group-item/toggle-group-item': { type: 'descendant' }
    },
    properties: {
        value: { type: Array, value: [] },
        disabled: { type: Boolean, value: false },
        multiple: { type: Boolean, value: false },
        rovingFocus: { type: Boolean, value: true },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, toggleGroup.machine, {
            id: this.properties.id || `toggle-group-${Math.random()}`,
            value: this.properties.value,
            disabled: this.properties.disabled,
            multiple: this.properties.multiple,
            rovingFocus: this.properties.rovingFocus,
            onValueChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:value', details.value)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = toggleGroup.connect(state, send, normalizeProps)
            this.setData({ api })

            const nodes = this.getRelationNodes('../toggle-group-item/toggle-group-item')
            nodes.forEach(node => {
                if (node.updateFromParent) node.updateFromParent(api)
            })
        }
    }
})
