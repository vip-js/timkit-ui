type NavigationItem = {
  label: string
  value: string
  disabled?: boolean
}

Component({
  options: {
    styleIsolation: 'apply-shared',
  },

  properties: {
    items: {
      type: Array,
      value: [],
    },
    value: {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  methods: {
    onSelect(e: WechatMiniprogram.BaseEvent) {
      const value = String(e.currentTarget.dataset.value || '')
      const item = ((this.properties.items || []) as NavigationItem[]).find((x) => x.value === value)
      if (!item || item.disabled) return
      this.triggerEvent('change', { value, item })
      this.triggerEvent('update:value', value)
    },
  },
})
