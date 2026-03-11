import * as datePicker from '@zag-js/date-picker'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../date-picker-trigger/date-picker-trigger': { type: 'descendant' },
    '../date-picker-content/date-picker-content': { type: 'descendant' },
    '../date-picker-calendar/date-picker-calendar': { type: 'descendant' },
    '../date-picker-input/date-picker-input': { type: 'descendant' },
  },
  properties: {
    value: { type: Array, value: [] },
    min: { type: String, value: '' }, // ISO string
    max: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    inline: { type: Boolean, value: false }, // For Calendar mode
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, datePicker.machine, {
      id: this.properties.id || `date-picker-${Math.random()}`,
      value: this.properties.value,
      // min: this.properties.min, // Zag might expect parseDate objects, we need to handle parsing if string
      // max: this.properties.max,
      disabled: this.properties.disabled,
      readOnly: this.properties.readOnly,
      inline: this.properties.inline,
      onOpenChange: (details) => {
        this.triggerEvent('openChange', details)
      },
      onValueChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:value', details.value)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = datePicker.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../date-picker-trigger/date-picker-trigger')
      updateChild('../date-picker-content/date-picker-content')
      updateChild('../date-picker-calendar/date-picker-calendar')
      updateChild('../date-picker-input/date-picker-input')
    },
  },
})
