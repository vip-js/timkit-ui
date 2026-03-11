import * as slider from '@zag-js/slider'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  properties: {
    value: { type: Array, value: [0] },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, slider.machine, {
      id: this.properties.id || `slider-${Math.random()}`,
      value: this.properties.value,
      min: this.properties.min,
      max: this.properties.max,
      step: this.properties.step,
      disabled: this.properties.disabled,
      onValueChange: (details) => {
        this.triggerEvent('change', details)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = slider.connect(state, send, normalizeProps)
      this.setData({ api })
    },

    // Slider needs pointer down/move logic which is hard in WeApp
    // WeApp provides a native slider component.
    // Zag slider is DOM based.
    // For WeApp, we might wrap native slider or implement touch logic.
    // Zag slider expects pointer events.
    // We can use bindtouchstart, bindtouchmove.
  },
})
