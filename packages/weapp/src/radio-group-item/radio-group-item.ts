import type { RadioGroupItemWeappProps } from '@timui/core'
import { radioGroupItemVariants } from '../utils'

type RadioGroupItemProperty = {
    type: StringConstructor | BooleanConstructor
    value: string | boolean
}

type RadioGroupParent = {
    handleChildChange: (value: string) => void
}

const radioGroupItemProps = {
    value: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    invalid: { type: Boolean, value: false },
    extClass: { type: String, value: '' }
} satisfies Record<keyof RadioGroupItemWeappProps, RadioGroupItemProperty>

Component({
  options: {
    styleIsolation: "apply-shared",
  },
    externalClasses: ['ext-class'],
    properties: radioGroupItemProps,
    relations: {
        '../radio-group/radio-group': {
            type: 'ancestor',
        }
    },
    data: {
        checked: false,
        className: ''
    },
    observers: {
        'extClass': function (extClass: string) {
            // Note: We cannot easily toggle classes based on 'checked' inside observer if the variant doesn't support it directly without 'data-state'.
            // But we can manually toggle.
            // Shared variant: '... data-[state=checked]:bg-primary ...'
            // We will rely on template logic for the data-state attribute or conditional classes?
            // Since we are using standard `radioGroupItemVariants`, it expects `className`. 
            // It DOES NOT accept `checked` as a variant prop in the current definition (it uses data-attributes in React).
            // So we just generate the base class here.
            this.setData({
                className: radioGroupItemVariants({ className: extClass })
            })
        }
    },
    methods: {
        handleTap() {
            if (this.properties.disabled) return
            const parent = this.getRelationNodes('../radio-group/radio-group')[0] as RadioGroupParent | undefined
            if (parent) {
                parent.handleChildChange(this.properties.value)
            }
        }
    }
})
