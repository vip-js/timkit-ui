import { useMachine, normalizeProps } from '../../utils/machine'
import * as zagSwitch from '@zag-js/switch'

Component({
    properties: {
        checked: { type: Boolean, value: false },
        disabled: { type: Boolean, value: false },
        value: { type: String, value: 'on' },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any
    },

    attached() {
        this.service = useMachine(this, zagSwitch.machine, {
            id: this.properties.id || `switch-${Math.random()}`,
            checked: this.properties.checked,
            disabled: this.properties.disabled,
            value: this.properties.value,
            onCheckedChange: (details) => {
                this.triggerEvent('change', details)
            }
        })

        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = zagSwitch.connect(state, send, normalizeProps)
            this.setData({ api })
        },

        handleClick() {
            if (this.data.api.rootProps && this.data.api.rootProps.onClick) {
                this.data.api.rootProps.onClick()
            }
        }
    }
})
