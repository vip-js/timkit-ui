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
      value: '',
    },
    'aria-label': {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    value: {
      type: null,
      value: null,
    },
    defaultValue: {
      type: null,
      value: null,
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
    ariaLabel: '',
    inputLabel: 'Command menu',
    selected: '',
    itemStatus: '',
    highlight: -1,
    filteredItems: [] as CommandItem[],
  },

  lifetimes: {
    attached() {
      const label = String(this.properties['aria-label'] || '')
      const placeholder = String(this.properties.placeholder || 'Command menu')
      this.setData({ ariaLabel: label, inputLabel: placeholder })
      this.filterItems('')
      const passed = this.properties.value
      const source = passed == null ? this.properties.defaultValue : passed
      const selected = String(source || '')
      if (selected) this.setData({ selected, itemStatus: this.itemText(selected, this.data.filteredItems) })
    },
  },

  observers: {
    items() {
      this.filterItems(this.data.query || '')
    },
    'aria-label'(value: unknown) {
      const next = String(value || '')
      if (next !== this.data.ariaLabel) this.setData({ ariaLabel: next })
    },
    placeholder(value: unknown) {
      const next = String(value || 'Command menu')
      if (next !== this.data.inputLabel) this.setData({ inputLabel: next })
    },
    value(next: unknown) {
      const selected = String(next ?? '')
      if (selected === String(this.data.selected ?? '')) return
      this.setData({ selected, itemStatus: this.itemText(selected) })
    },
  },

  methods: {
    itemText(selected: string, items?: CommandItem[]) {
      const list = items ?? ((this.data.filteredItems || []) as CommandItem[])
      if (!selected || !list.length) return ''
      const index = list.findIndex((item) => item.value === selected)
      return index < 0 ? '' : `Item ${index + 1} of ${list.length}`
    },
    filterItems(query: string) {
      const source = (this.properties.items || []) as CommandItem[]
      const q = normalize(query).trim()
      const filtered = !q
        ? source
        : source.filter((item) => {
            const haystack = `${item.label} ${item.value} ${item.keywords || ''}`.toLowerCase()
            return haystack.includes(q)
          })
      const highlight = filtered.findIndex((item) => !item.disabled)
      this.setData({
        filteredItems: filtered,
        highlight,
        itemStatus: this.itemText(String(this.data.selected || ''), filtered),
      })
    },
    moveHighlight(delta: number) {
      const items = (this.data.filteredItems || []) as CommandItem[]
      const indexes = items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0)
      if (!indexes.length) return
      const place = indexes.indexOf(Number(this.data.highlight))
      const next = place < 0 ? indexes[0] : indexes[(place + delta + indexes.length) % indexes.length]
      this.setData({ highlight: next })
    },
    onKey(event?: { detail?: { key?: string } }) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || '')
      if (key === 'ArrowDown') this.moveHighlight(1)
      else if (key === 'ArrowUp') this.moveHighlight(-1)
      else if (key === 'Enter') {
        const item = (this.data.filteredItems || [])[Number(this.data.highlight)] as CommandItem | undefined
        if (!item || item.disabled) return
        this.onSelect({ currentTarget: { dataset: { value: item.value } } })
      }
    },
    onItemKey(event?: { detail?: { key?: string }; currentTarget?: { dataset?: { value?: string } } }) {
      const key = String(event?.detail?.key || '')
      if (key !== 'Enter') return
      this.onSelect(event)
    },

    onInput(e: WechatMiniprogram.Input) {
      if (this.properties.disabled) return
      const query = String(e.detail.value || '')
      this.setData({ query })
      this.filterItems(query)
    },

    onSelect(e: WechatMiniprogram.BaseEvent) {
      if (this.properties.disabled) return
      const value = String(e.currentTarget.dataset.value || '')
      const item = (this.data.filteredItems || []).find((entry) => entry.value === value)
      if (!item || item.disabled) return
      if (this.properties.value == null) this.setData({ selected: value, itemStatus: this.itemText(value) })
      this.triggerEvent('select', item)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'command', item)
    },
  },
})
