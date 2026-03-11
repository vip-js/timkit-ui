import { emitTimEvent, inputVariants } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'

type WeappInputDetail = {
  value: string
}

type WeappInputEvent = WechatMiniprogram.CustomEvent<WeappInputDetail>

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    value: { type: String, value: '' },
    type: { type: String, value: 'text' },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    maxlength: { type: Number, value: 140 },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
    ...createWeappBaseProps('input'),
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
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass })
    },

    onInput(e: WeappInputEvent) {
      this.setData({ value: e.detail.value })
      this.triggerEvent('input', e.detail)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'input', {
        value: e.detail.value,
      })
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
