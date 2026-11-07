import { emitTimEvent } from '../utils'

type ListBoxItem = {
  label: string
  value: string
  disabled?: boolean
}

const selectedFrom = (value: unknown) => {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (value === undefined || value === null || value === '') return []
  return [String(value)]
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
    multiple: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    id: {
      type: String,
      value: 'list-box',
    },
    'aria-label': {
      type: String,
      value: '',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    selected: [] as string[],
    highlight: -1,
    ariaLabel: '',
  },

  lifetimes: {
    attached() {
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      this.setData({
        selected: selectedFrom(source),
        ariaLabel: String(this.properties['aria-label'] || ''),
      })
    },
  },

  observers: {
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    'items, value, multiple'() {
      this.syncFromProps()
    },
    value(next: unknown) {
      const selected = selectedFrom(next)
      const current = (this.data.selected || []).map((item: string) => String(item))
      if (selected.join('\0') === current.join('\0')) return
      this.setData({ selected })
    },
  },

  methods: {
    syncFromProps() {
      this.setData({ selected: selectedFrom(this.properties.value) })
    },

    enabledIndexes() {
      return ((this.properties.items || []) as ListBoxItem[])
        .map((item, index) => (item?.value && !item.disabled ? index : -1))
        .filter((index) => index >= 0)
    },
    moveHighlight(delta: number) {
      const enabled = this.enabledIndexes()
      if (!enabled.length) return
      const current = enabled.indexOf(this.data.highlight)
      const start = current < 0 ? (delta > 0 ? -1 : 0) : current
      const next = enabled[(start + delta + enabled.length) % enabled.length]
      this.setData({ highlight: next })
    },
    onKey(event?: { detail?: { key?: string } }) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || '')
      if (key === 'Home' || key === 'End') {
        const enabled = this.enabledIndexes()
        if (!enabled.length) return
        this.setData({ highlight: enabled[key === 'Home' ? 0 : enabled.length - 1] })
        return
      }
      if (/^[a-z]$/i.test(key)) {
        const enabled = this.enabledIndexes()
        const source = (this.properties.items || []) as ListBoxItem[]
        const letter = key.toLowerCase()
        const current = enabled.indexOf(this.data.highlight)
        for (let step = 1; step <= enabled.length; step += 1) {
          const index = enabled[(current + step) % enabled.length]
          const item = source[index]
          const name = String(item?.label || item?.value || '').trim().toLowerCase()
          if (!name.startsWith(letter)) continue
          this.setData({ highlight: index })
          return
        }
        return
      }
      if (key === 'ArrowDown') {
        this.moveHighlight(1)
        return
      }
      if (key === 'ArrowUp') {
        this.moveHighlight(-1)
        return
      }
      if (key !== 'Enter' && key !== ' ') return
      const item = ((this.properties.items || []) as ListBoxItem[])[this.data.highlight]
      if (!item?.value || item.disabled) return
      this.onSelect({ currentTarget: { dataset: { value: item.value } } } as WechatMiniprogram.BaseEvent)
    },
    onOptionKey(event?: { detail?: { key?: string }; currentTarget?: { dataset?: { value?: string } } }) {
      const value = String(event?.currentTarget?.dataset?.value || '')
      const index = ((this.properties.items || []) as ListBoxItem[]).findIndex((item) => item.value === value)
      if (index >= 0) this.setData({ highlight: index })
      this.onKey(event)
    },
    onSelect(e: WechatMiniprogram.BaseEvent) {
      if (this.properties.disabled) return
      const value = String(e.currentTarget.dataset.value || '')
      const item = ((this.properties.items || []) as ListBoxItem[]).find((entry) => entry.value === value)
      if (!value || !item || item.disabled) return
      const current = this.data.selected || []
      const next = this.properties.multiple
        ? current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value]
        : [value]
      const payload = this.properties.multiple ? next : next[0]
      if (this.properties.value == null) this.setData({ selected: next })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'list-box', { value: payload })
      this.triggerEvent('change', { value: payload })
    },
  },
})
