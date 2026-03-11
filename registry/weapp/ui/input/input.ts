import { cva } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const inputVariants = cva(
  'border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
)

Component({
  properties: {
    className: { type: String, value: '' },
    value: { type: String, value: '' },
    type: { type: String, value: 'text' },
    password: { type: Boolean, value: false },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
    confirmHold: { type: Boolean, value: false },
    cursor: { type: Number, value: -1 },
    selectionStart: { type: Number, value: -1 },
    selectionEnd: { type: Number, value: -1 },
    adjustPosition: { type: Boolean, value: true },
    holdKeyboard: { type: Boolean, value: false },
  },
  data: {
    className: '',
  },
  observers: {
    className: function (className) {
      this.setData({
        className: cn(inputVariants(), className),
      })
    },
  },
  methods: {
    onInput(e: any) {
      this.triggerEvent('input', e.detail)
    },
    onFocus(e: any) {
      this.triggerEvent('focus', e.detail)
    },
    onBlur(e: any) {
      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e: any) {
      this.triggerEvent('confirm', e.detail)
    },
    onKeyboardHeightChange(e: any) {
      this.triggerEvent('keyboardheightchange', e.detail)
    },
  },
})
