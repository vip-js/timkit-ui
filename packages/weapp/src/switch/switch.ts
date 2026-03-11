import { emitTimEvent, resolveClasses, switchVariants } from '../utils'

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    color: { type: String, value: '#1aad19' },
    name: { type: String, value: '' },
    id: { type: String, value: 'switch' },
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
      const className = resolveClasses(switchVariants({ className: this.properties.extClass }))
      this.setData({ className })
    },

    onSwitchChange(e: WechatMiniprogram.CustomEvent) {
      const checked = !!e.detail.value
      this.triggerEvent('input', { value: checked })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'switch', {
        checked,
      })
    },
  },
})
