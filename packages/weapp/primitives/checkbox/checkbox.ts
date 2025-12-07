import { checkboxStyles } from '@timui/shared'

import { resolveClasses } from '../../utils'

Component({
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    className: {
      type: String,
      value: '',
    },
  },

  data: {
    computedClass: '',
  },

  observers: {
    'checked, disabled, className': function (checked, disabled, className) {
      // 1. Get CVA base string
      const cvaClass = checkboxStyles()

      // 2. Resolve to Weapp atomic utilities
      // We manually toggle data attributes in class string for Weapp resolver if needed,
      // But `checkboxStyles` uses `data-[state=checked]`.
      // We need to conditionally append these classes based on props.

      // Hack/Adapter: manually inject the state class so tailwind-merge/resolveClasses can handle it?
      // Or better: `checkboxStyles({ className })` doesn't handle state variants passed as props, relying on data attributes.
      // We need to implement a "State Simulator" in Weapp.

      // Let's modify resolveClasses or just conditional string concat.
      // "data-[state=checked]:bg-primary" -> In web this matches attribute.
      // In Weapp, we don't have attribute selectors in WXSS easily mapping to Tailwind unless we generated specific state classes.

      // Simplified approach for Weapp:
      // We probably generated utilities like `data-state-checked:bg-primary` (replacing [ ] with -).
      // Let's assume our utility generator handles this.

      const stateClass = checked ? 'data-state-checked' : 'data-state-unchecked'
      const disabledClass = disabled ? 'disabled' : ''

      const resolved = resolveClasses(`${cvaClass} ${className} ${stateClass} ${disabledClass}`)

      this.setData({ computedClass: resolved })
    },
  },

  methods: {
    toggle() {
      if (this.data.disabled) return
      const newValue = !this.data.checked
      this.triggerEvent('change', { checked: newValue })
      // Controlled mode usually requires parent to update, but we can optimistically update or wait?
      // Standard Weapp: internal state + event.
    },
  },
})
