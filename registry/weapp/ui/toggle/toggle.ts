import * as toggle from '@zag-js/toggle'

import { normalizeProps, useMachine } from '../../utils/machine'

Component({
  properties: {
    pressed: { type: Boolean, value: false },
    defaultPressed: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    id: { type: String, value: '' },
  },

  data: {
    api: {} as any,
  },

  attached() {
    this.service = useMachine(this, toggle.machine, {
      id: this.properties.id || `toggle-${Math.random()}`,
      pressed: this.properties.pressed,
      defaultPressed: this.properties.defaultPressed,
      disabled: this.properties.disabled,
      onPressedChange: (details) => {
        this.triggerEvent('change', details)
        this.triggerEvent('update:pressed', details.pressed)
      },
    })

    this.updateApi(this.service.state, this.service.send)
  },

  methods: {
    updateApi(state, send) {
      const api = toggle.connect(state, send, normalizeProps)
      this.setData({ api })
    },
    handleClick() {
      if (this.data.api.rootProps && this.data.api.rootProps.onClick) {
        this.data.api.rootProps.onClick()
      }
    },
  },
})
