import type { SwitchProps } from '@timui/core'

import { switchThumbVariants, switchVariants } from '../utils'

const switchProps = {
  checked: { type: Boolean, value: false },
  defaultChecked: { type: Boolean, value: false },
  disabled: { type: Boolean, value: false },
  required: { type: Boolean, value: false },
  readOnly: { type: Boolean, value: false },
  invalid: { type: Boolean, value: false },
  name: { type: String, value: '' },
  form: { type: String, value: '' },
  value: { type: null, value: 'on' },
  label: { type: String, value: '' },
  id: { type: String, value: '' },
  extClass: { type: String, value: '' },
}

type SwitchWeappProps = SwitchProps & {
  extClass?: string
}

type SwitchPropDefinition = {
  type:
    | StringConstructor
    | BooleanConstructor
    | NumberConstructor
    | ArrayConstructor
    | ObjectConstructor
    | FunctionConstructor
    | null
  value?: string | boolean | number | number[]
}

const switchPropsWithTypes = switchProps satisfies Partial<
  Record<keyof SwitchWeappProps, SwitchPropDefinition>
>

Component({
  properties: switchPropsWithTypes,
  data: {
    className: '',
    thumbClassName: '',
  },
  lifetimes: {
    attached() {
      this.setData({
        className: switchVariants({ className: this.properties.extClass }),
        thumbClassName: switchThumbVariants(),
      })
    },
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: switchVariants({ className: extClass }),
        thumbClassName: switchThumbVariants(),
      })
    },
    checked: function (checked) {
      this.setData({ checked })
    },
    defaultChecked: function (val) {
      if (this.properties.checked === false && val) {
        this.setData({ checked: val })
      }
    },
  },
  methods: {
    handleTap() {
      if (this.properties.disabled || this.properties.readOnly) return
      const newValue = !this.properties.checked
      this.setData({ checked: newValue })
      this.triggerEvent('change', { value: newValue })
    },
  },
})
