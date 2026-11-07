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
      type: null,
      value: null,
    },
    defaultValue: {
      type: null,
      value: null,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    id: {
      type: String,
      value: 'navigation-menu',
    },
    extClass: {
      type: String,
      value: '',
    },
    'aria-label': {
      type: String,
      value: '',
    },
    'aria-labelledby': {
      type: String,
      value: '',
    },
  },

  data: {
    selected: '',
    itemStatus: '',
    ariaLabel: '',
    labelledBy: '',
  },

  lifetimes: {
    attached() {
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const selected = source == null || source === '' ? '' : String(source)
      this.setData({
        selected,
        itemStatus: this.itemText(selected),
        ariaLabel: String(this.properties['aria-label'] || ''),
        labelledBy: String(this.properties['aria-labelledby'] || ''),
      })
    },
  },

  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'aria-labelledby'(next: string) {
      const labelledBy = String(next || '')
      if (labelledBy === this.data.labelledBy) return
      this.setData({ labelledBy })
    },
    value(value: unknown) {
      if (value == null) return
      const next = String(value)
      if (next !== this.data.selected) this.setData({ selected: next, itemStatus: this.itemText(next) })
    },
  },

  methods: {
    itemText(selected: string) {
      const items = (this.properties.items || []) as NavigationItem[]
      if (!selected || !items.length) return ''
      const index = items.findIndex((item) => item.value === selected)
      return index < 0 ? '' : `Item ${index + 1} of ${items.length}`
    },
    onSelectKey(e: WechatMiniprogram.BaseEvent & { detail?: { key?: string } }) {
      const key = String(e?.detail?.key || '')
      if (key === 'Enter') this.onSelect(e)
    },
    onSelect(e: WechatMiniprogram.BaseEvent) {
      if (this.properties.disabled) return
      const value = String(e.currentTarget.dataset.value || '')
      const item = ((this.properties.items || []) as NavigationItem[]).find(
        (x) => x.value === value
      )
      if (!item || item.disabled) return
      if (this.properties.value != null) {
        this.triggerEvent('update:value', value)
        return
      }
      this.setData({ selected: value, itemStatus: this.itemText(value) })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'navigation-menu', {
        value,
        item,
      })
      this.triggerEvent('update:value', value)
    },
  },
})
