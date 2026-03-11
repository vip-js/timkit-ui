import { emitTimEvent } from '../utils'

type CommandItem = {
  label: string
  value: string
  keywords?: string
  disabled?: boolean
}

const normalize = (value: object) => String(value ?? '').toLowerCase()

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
    placeholder: {
      type: String,
      value: 'Type a command...',
    },
    id: {
      type: String,
      value: 'command',
    },
    extClass: {
      type: String,
      value: '',
    },
  },

  data: {
    query: '',
    filteredItems: [] as CommandItem[],
  },

  lifetimes: {
    attached() {
      this.filterItems('')
    },
  },

  observers: {
    items() {
      this.filterItems(this.data.query || '')
    },
  },

  methods: {
    filterItems(query: string) {
      const source = (this.properties.items || []) as CommandItem[]
      const q = normalize(query).trim()
      if (!q) {
        this.setData({ filteredItems: source })
        return
      }
      const filtered = source.filter((item) => {
        const haystack = `${item.label} ${item.value} ${item.keywords || ''}`.toLowerCase()
        return haystack.includes(q)
      })
      this.setData({ filteredItems: filtered })
    },

    onInput(e: WechatMiniprogram.Input) {
      const query = String(e.detail.value || '')
      this.setData({ query })
      this.filterItems(query)
    },

    onSelect(e: WechatMiniprogram.BaseEvent) {
      const value = String(e.currentTarget.dataset.value || '')
      const item = (this.data.filteredItems || []).find((entry) => entry.value === value)
      if (!item || item.disabled) return
      this.triggerEvent('select', item)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'command', item)
    },
  },
})
