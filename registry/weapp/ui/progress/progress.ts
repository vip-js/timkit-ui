import { useMachine, normalizeProps } from '../../utils/machine'
import * as progress from '@zag-js/progress'

Component({
    properties: {
        value: { type: Number, value: 0 },
        max: { type: Number, value: 100 },
        id: { type: String, value: '' }
    },

    data: {
        api: {} as any,
        percent: 0
    },

    attached() {
        this.service = useMachine(this, progress.machine, {
            id: this.properties.id || `progress-${Math.random()}`,
            value: this.properties.value,
            max: this.properties.max || 100
        })

        this.updateApi(this.service.state, this.service.send)
    },

    observers: {
        'value': function (val) {
            if (this.service) {
                this.service.send({ type: 'VALUE.SET', value: val })
            }
        }
    },

    methods: {
        updateApi(state, send) {
            const api = progress.connect(state, send, normalizeProps)
            this.setData({
                api,
                percent: api.percent
            })
        }
    }
})
