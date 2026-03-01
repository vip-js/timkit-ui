import { useMachine, normalizeProps } from '../../utils/machine'
import * as radioGroup from '@zag-js/radio-group'

Component({
    relations: {
        '../radio-group-item/radio-group-item': {
            type: 'descendant',
            linked(target) {
                if (this.data.api.value) target.updateFromParent(this.data.api)
            }
        }
    },
    properties: {
        value: { type: String, value: '' },
        disabled: { type: Boolean, value: false },
        name: { type: String, value: '' },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, radioGroup.machine, {
            id: this.properties.id || `radio-group-${Math.random()}`,
            value: this.properties.value,
            name: this.properties.name,
            disabled: this.properties.disabled,
            onValueChange: (details) => {
                this.triggerEvent('change', details)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = radioGroup.connect(state, send, normalizeProps)
            this.setData({ api })

            const nodes = this.getRelationNodes('../radio-group-item/radio-group-item')
            nodes.forEach(node => node.updateFromParent(api))
        }
    }
})
