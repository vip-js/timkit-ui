import { emitTimEvent } from '../utils'

type NavigationItem = {
  label: string
  value: string
  disabled?: boolean
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    items: {
      type: Array,
      value: [],
    },
    value: {
      type: String,
      value: '',
    },
    id: {
      type: String,
      value: 'navigation-menu',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  methods: {
    onSelect(e: WechatMiniprogram.BaseEvent) {
      const value = String(e.currentTarget.dataset.value || '')
      const item = ((this.properties.items || []) as NavigationItem[]).find(
        (x) => x.value === value
      )
      if (!item || item.disabled) return
      emitTimEvent(this, 'change', 'change', this.properties.id || 'navigation-menu', {
        value,
        item,
      })
      this.triggerEvent('update:value', value)
    },
  },
})
