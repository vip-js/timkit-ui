import { inputVariants } from '../utils'

type WeappInputDetail = {
  value: string
}

type WeappInputEvent = WechatMiniprogram.CustomEvent<WeappInputDetail>

Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    value: { type: String, value: '' },
    type: { type: String, value: 'text' },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    maxlength: { type: Number, value: 140 },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
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
    'type, extClass': function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // Use core package's inputVariants for consistent styling
      const { baseClass } = inputVariants({
        type: this.properties.type === 'search' ? 'search' : 'default',
        className: this.properties.extClass
      })

      this.setData({ className: baseClass })
    },

    onInput(e: WeappInputEvent) {
      this.setData({ value: e.detail.value })
      this.triggerEvent('input', e.detail)
    },
    onFocus(e: WeappInputEvent) {
      this.triggerEvent('focus', e.detail)
    },
    onBlur(e: WeappInputEvent) {
      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e: WeappInputEvent) {
      this.triggerEvent('confirm', e.detail)
    },
  },
})
