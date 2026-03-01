import type { RadioGroupProps } from '@timui/core'

import { radioGroupVariants } from '../utils'

type PropDefinition = {
  type: StringConstructor | BooleanConstructor | null
  value?: string | boolean
}

type RadioGroupWeappProps = RadioGroupProps & {
  extClass?: string
}

const radioGroupProps = {
  value: { type: String, value: '' },
  defaultValue: { type: String, value: '' },
  name: { type: String, value: '' },
  form: { type: String, value: '' },
  disabled: { type: Boolean, value: false },
  invalid: { type: Boolean, value: false },
  required: { type: Boolean, value: false },
  readOnly: { type: Boolean, value: false },
  orientation: { type: String, value: 'vertical' },
  id: { type: String, value: '' },
  extClass: { type: String, value: '' },
} satisfies Partial<Record<keyof RadioGroupWeappProps, PropDefinition>>

Component({
  externalClasses: ['ext-class'],
  properties: radioGroupProps,
  relations: {
    '../radio-group-item/radio-group-item': {
      type: 'descendant',
      linked(target) {
        // Propagate value to child
        if (this.data.value) {
          target.setData({ checked: this.data.value === target.data.value })
        }
      },
    },
  },
  data: {
    className: '',
    value: '',
  },
  observers: {
    extClass: function (extClass) {
      this.setData({
        className: radioGroupVariants({ className: extClass }),
      })
    },
    value: function (val) {
      const nodes = this.getRelationNodes('../radio-group-item/radio-group-item')
      if (nodes && nodes.length) {
        nodes.forEach((node) => {
          node.setData({ checked: val === node.data.value })
        })
      }
      this.setData({ value: val })
      this.triggerEvent('change', { value: val })
    },
    defaultValue: function (val) {
      if (!this.data.value && val) {
        this.setData({ value: val })
      }
    },
  },
  methods: {
    handleChildChange(value) {
      this.setData({ value })
    },
  },
})
