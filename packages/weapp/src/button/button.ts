import { buttonVariants, createTimEvent, type JsonValue } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'

type TapEvent = WechatMiniprogram.BaseEvent<{
  value?: string
}>

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    variant: { type: String, value: 'default' },
    size: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    plain: { type: Boolean, value: false },
    ...createWeappBaseProps('button'),
    // 微信原生 <button> 能力
    openType: { type: String, value: '' },
    formType: { type: String, value: '' },
    hoverClass: { type: String, value: 'button-hover' },
    hoverStopPropagation: { type: Boolean, value: false },
    hoverStartTime: { type: Number, value: 20 },
    hoverStayTime: { type: Number, value: 70 },
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
    'variant, size, disabled, loading, plain, extClass': function () {
      this.updateClassName()
    },
  },

  methods: {
    updateClassName() {
      // buttonVariants is a CVA function returning a string (not {baseClass})
      const baseClass = buttonVariants({
        variant: (this.properties.variant || 'default') as
          | 'default'
          | 'destructive'
          | 'outline'
          | 'secondary'
          | 'ghost'
          | 'link',
        size: (this.properties.size === 'icon' ? 'icon' : this.properties.size || 'default') as
          | 'default'
          | 'sm'
          | 'lg'
          | 'icon',
      })

      const classes = [baseClass]

      if (this.properties.extClass) {
        classes.push(this.properties.extClass)
      }
      if (this.properties.disabled) {
        classes.push('button-disabled')
      }
      if (this.properties.loading) {
        classes.push('button-loading')
      }
      if (this.properties.plain) {
        classes.push('button-plain')
      }

      this.setData({ className: classes.join(' ') })
    },

    onTap(_e: TapEvent) {
      if (!this.properties.disabled && !this.properties.loading) {
        this.triggerEvent('tap', {})
        const buttonId = this.properties.id || 'button'
        this.triggerEvent(
          'press',
          createTimEvent('press', buttonId, {}) as Record<string, JsonValue>
        )
      }
    },
    // 微信原生 button 事件透传
    onGetPhoneNumber(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('getphonenumber', e.detail)
    },
    onGetUserInfo(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('getuserinfo', e.detail)
    },
    onOpenSetting(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('opensetting', e.detail)
    },
    onError(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('error', e.detail)
    },
    onContact(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('contact', e.detail)
    },
  },
})
