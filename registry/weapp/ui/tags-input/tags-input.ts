import { useMachine, normalizeProps } from '../../utils/machine'
import * as tagsInput from '@zag-js/tags-input'

Component({
    relations: {
        '../tags-input-label/tags-input-label': { type: 'descendant' },
        '../tags-input-control/tags-input-control': { type: 'descendant' },
        '../tags-input-input/tags-input-input': { type: 'descendant' },
        '../tags-input-item/tags-input-item': { type: 'descendant' },
        '../tags-input-clear-trigger/tags-input-clear-trigger': { type: 'descendant' }
    },
    properties: {
        value: { type: Array, value: [] },
        disabled: { type: Boolean, value: false },
        readOnly: { type: Boolean, value: false },
        addOnPaste: { type: Boolean, value: false },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, tagsInput.machine, {
            id: this.properties.id || `tags-input-${Math.random()}`,
            value: this.properties.value,
            disabled: this.properties.disabled,
            readOnly: this.properties.readOnly,
            addOnPaste: this.properties.addOnPaste,
            onValueChange: (details) => {
                this.triggerEvent('change', details)
                this.triggerEvent('update:value', details.value)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = tagsInput.connect(state, send, normalizeProps)
            this.setData({ api })

            const updateChild = (path) => {
                const nodes = this.getRelationNodes(path)
                nodes.forEach(node => {
                    if (node.updateFromParent) node.updateFromParent(api)
                })
            }

            updateChild('../tags-input-label/tags-input-label')
            updateChild('../tags-input-control/tags-input-control')
            updateChild('../tags-input-input/tags-input-input')
            updateChild('../tags-input-item/tags-input-item')
            updateChild('../tags-input-clear-trigger/tags-input-clear-trigger')
        }
    }
})
