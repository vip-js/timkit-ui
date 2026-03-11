import * as numberInput from '@zag-js/number-input'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  relations: {
    '../stepper-input/stepper-input': { type: 'descendant' },
    '../stepper-increment-trigger/stepper-increment-trigger': { type: 'descendant' },
    '../stepper-decrement-trigger/stepper-decrement-trigger': { type: 'descendant' },
  },
  properties: {
    value: { type: String, value: '' }, // Zag number input uses string usually for precision? or number. Zag docs say value is string (formatted).
    min: { type: Number, value: Number.MIN_SAFE_INTEGER },
    max: { type: Number, value: Number.MAX_SAFE_INTEGER },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, numberInput.machine, {
      id: this.properties.id || `stepper-${Math.random()}`,
      value: this.properties.value,
      min: this.properties.min,
      max: this.properties.max,
      step: this.properties.step,
      disabled: this.properties.disabled,
      readOnly: this.properties.readOnly,
      onValueChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:value', details.value)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = numberInput.connect(state, send, normalizeProps)
      this.setData({ api })

      const updateChild = (path) => {
        const nodes = this.getRelationNodes(path)
        nodes.forEach((node) => {
          if (node.updateFromParent) node.updateFromParent(api)
        })
      }

      updateChild('../stepper-input/stepper-input')
      updateChild('../stepper-increment-trigger/stepper-increment-trigger')
      updateChild('../stepper-decrement-trigger/stepper-decrement-trigger')
    },
  },
})
