import { useMachine, normalizeProps } from '../../utils/machine'
import * as checkbox from '@zag-js/checkbox'

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
        this.service = useMachine(this, checkbox.machine, {
            id: this.properties.id || `checkbox-${Math.random()}`,
            checked: this.properties.checked,
            disabled: this.properties.disabled,
            value: this.properties.value,
            onCheckedChange: (details) => {
                this.triggerEvent('change', details)
            }
        })

        // Initial update
        this.updateApi(this.service.state, this.service.send)
    },

    methods: {
        updateApi(state, send) {
            const api = checkbox.connect(state, send, normalizeProps)
            this.setData({ api })
        },

        handleClick() {
            // WeApp tap event
            // Call the click handler from Zag if it exists, or just toggle
            // Zag usually exposes `setChecked` or handles via rootProps.onClick
            // api.rootProps.onClick is what we want
            if (this.data.api.rootProps && this.data.api.rootProps.onClick) {
                this.data.api.rootProps.onClick()
            }
        }
    }
})
