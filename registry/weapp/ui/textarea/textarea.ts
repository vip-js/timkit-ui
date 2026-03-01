import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const textareaVariants = cva(
    'border-input placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-19.5 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)

Component({
    properties: {
        className: { type: String, value: '' },
        value: { type: String, value: '' },
        placeholder: { type: String, value: '' },
        disabled: { type: Boolean, value: false },
        maxlength: { type: Number, value: 140 },
        autoFocus: { type: Boolean, value: false },
        focus: { type: Boolean, value: false },
        autoHeight: { type: Boolean, value: false },
        fixed: { type: Boolean, value: false },
        cursorSpacing: { type: Number, value: 0 },
        cursor: { type: Number, value: -1 },
        showConfirmBar: { type: Boolean, value: true },
        selectionStart: { type: Number, value: -1 },
        selectionEnd: { type: Number, value: -1 },
        adjustPosition: { type: Boolean, value: true },
        holdKeyboard: { type: Boolean, value: false },
    },
    data: {
        className: '',
    },
    observers: {
        'className': function (className) {
            this.setData({
                className: cn(textareaVariants(), className),
            })
        },
    },
    methods: {
        onInput(e: any) { this.triggerEvent('input', e.detail) },
        onFocus(e: any) { this.triggerEvent('focus', e.detail) },
        onBlur(e: any) { this.triggerEvent('blur', e.detail) },
        onConfirm(e: any) { this.triggerEvent('confirm', e.detail) },
        onLineChange(e: any) { this.triggerEvent('linechange', e.detail) },
    },
})
