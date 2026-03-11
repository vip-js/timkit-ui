import { emitTimEvent, textareaVariants } from '../utils'

type WeappTextareaDetail = {
  value: string
}

type WeappTextareaEvent = WechatMiniprogram.CustomEvent<WeappTextareaDetail>

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    value: { type: String, value: '' },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    maxlength: { type: Number, value: -1 },
    autoHeight: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    id: { type: String, value: 'textarea' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
  },

  lifetimes: {
    attached() {
      this.updateClassName()
    },
  },

  observers: {
    extClass: function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's textareaVariants for consistent styling
      const { baseClass } = textareaVariants({
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass })
    },

    onInput(e: WeappTextareaEvent) {
      this.setData({ value: e.detail.value })
      this.triggerEvent('input', e.detail)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'textarea', {
        value: e.detail.value,
      })
    },
    onFocus(e: WeappTextareaEvent) {
      this.triggerEvent('focus', e.detail)
    },
    onBlur(e: WeappTextareaEvent) {
      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e: WeappTextareaEvent) {
      this.triggerEvent('confirm', e.detail)
    },
  },
})
