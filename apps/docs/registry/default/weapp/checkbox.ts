import type { CheckboxProps } from '@timui/core'

import { checkboxVariants } from '../utils'

type CheckboxWeappProps = CheckboxProps & {
  extClass?: string
}

const checkboxProps = {
  checked: { type: null, value: false },
  defaultChecked: { type: null, value: false },
  disabled: { type: Boolean, value: false },
  required: { type: Boolean, value: false },
  readOnly: { type: Boolean, value: false },
  invalid: { type: Boolean, value: false },
  name: { type: String, value: '' },
  form: { type: String, value: '' },
  value: { type: String, value: 'on' },
  id: { type: String, value: '' },
  extClass: { type: String, value: '' },
} satisfies Partial<Record<keyof CheckboxWeappProps, any>>

Component({
  externalClasses: ['ext-class'],
  properties: checkboxProps,
  data: {
    className: '',
    checked: false,
    indeterminate: false,
  },
  observers: {
    'checked, defaultChecked, disabled, extClass': function () {
      // Checkbox variants in shared do not have variants yet, just base strings.
      // But they might use data attributes in React.
      // For WeApp, we just apply the base class + extClass.
      // Ideally we should pass state to variants if cva supported it, but cva uses `variants` prop.
      // The shared variant uses `data-[state=checked]`. We need to simulate this or just use the base if static.
      // Wait, the shared variant relies heavily on `data-[state=checked]` selectors which Tailwind maps to attribute selectors.
      // In WeApp we don't have data attributes driving CSS in the same way with native Tailwind unless we use specific utility classes.
      // But wait! The shared definition is: `data-[state=checked]:bg-primary ...`
      // WeApp doesn't support attribute selectors in WXSS efficiently or at all for Tailwind JIT in this way unless we shim it.
      // STRATEGY: We will resolve the class string assuming the state is passed as a variant OR manually toggle classes?
      // actually, `cva` doesn't handle `data-state` automatically unless it's a compound variant.
      // The React component uses `cn(checkboxStyles(), className)`.
      // The styles rely on the specific dom element having `data-state="checked"`.
      // In WeApp, we must CONDITIONALLY apply these classes or use a utility that maps state to class.
      // For now, I will implement a basic version and potentially refine the shared variant to use "variants" instead of data-attributes for better portability?
      // NO, I must use the Shared Universal Variants.
      // If the shared variant uses `data-[state=checked]`, I can't easily use it in WeApp without that attribute.
      // However, I can pass `class="... data-[state=checked]"`? No, that's a selector.
      // I need to add `data-state="{{checked ? 'checked' : 'unchecked'}}"` to the view in WXML!
      // And strict Tailwind extraction needs to see it? No, raw string is fine.
      this.setData({
        className: checkboxVariants({ className: this.properties.extClass }),
      })
    },
    checked: function (checked) {
      if (checked === 'indeterminate') {
        this.setData({ checked: false, indeterminate: true })
        return
      }
      if (typeof checked === 'boolean') {
        this.setData({ checked, indeterminate: false })
      }
    },
  },
  lifetimes: {
    attached() {
      const checkedProp = this.properties.checked
      const defaultChecked = this.properties.defaultChecked
      const resolved =
        checkedProp === 'indeterminate'
          ? 'indeterminate'
          : typeof checkedProp === 'boolean'
            ? checkedProp
            : defaultChecked
      this.setData({
        checked: resolved === true,
        indeterminate: resolved === 'indeterminate',
      })
    },
  },
})
