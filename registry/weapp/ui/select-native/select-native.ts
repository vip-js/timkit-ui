import { cn } from '../../lib/utils'

Component({
    properties: {
        className: { type: String, value: '' },
        value: { type: null, value: null },
        options: { type: Array, value: [] },
        rangeKey: { type: String, value: '' }, // Key to display if options are objects
        placeholder: { type: String, value: 'Select...' },
        disabled: { type: Boolean, value: false },
        mode: { type: String, value: 'selector' },
    },
    data: {
        className: '',
        displayValue: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn('', className),
            })
        },
        'value, options, rangeKey': function (value, options, rangeKey) {
            this.updateDisplayValue(value, options, rangeKey)
        }
    },
    methods: {
        updateDisplayValue(value: any, options: any[], rangeKey: string) {
            if (this.properties.mode === 'selector') {
                // Selector mode: value is index
                const index = parseInt(value)
                if (!isNaN(index) && index >= 0 && index < options.length) {
                    const selected = options[index]
                    const display = rangeKey ? selected[rangeKey] : selected
                    this.setData({ displayValue: display })
                } else {
                    this.setData({ displayValue: '' })
                }
            } else {
                // Other modes (date, time, etc): value is directly displayable usually
                this.setData({ displayValue: value })
            }
        },
        onChange(e: any) {
            this.triggerEvent('change', e.detail)
        }
    }
})
