import { emitTimEvent } from '../utils'

type NativeOption = { label: string; value: string }

const normalize = (options: unknown): NativeOption[] => {
  if (!Array.isArray(options)) return []
  return options.map((item, index) => {
    if (item && typeof item === 'object') {
      const record = item as { label?: unknown; value?: unknown }
      const value = record.value != null && record.value !== '' ? String(record.value) : String(index)
      const label = record.label != null ? String(record.label) : value
      return { label, value }
    }
    const text = String(item ?? '')
    return { label: text, value: text }
  })
}

const selectedFrom = (raw: unknown, options: NativeOption[]) => {
  if (typeof raw === 'number' && Number.isFinite(raw)) return options[raw]?.value ?? ''
  if (typeof raw === 'string') return raw
  return ''
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },
  externalClasses: ['ext-class'],
  properties: {
    options: {
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
    multiple: {
      type: Boolean,
      value: false,
    },
    id: {
      type: String,
      value: 'select-native',
    },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    extClass: {
      type: String,
      value: '',
    },
  },
  data: {
    className: '',
    labels: [] as string[],
    selected: '',
    selectedValues: [] as string[],
    optionRows: [] as Array<NativeOption & { checked: boolean }>,
    index: 0,
    displayText: '',
    optionStatus: '',
  },
  lifetimes: {
    attached() {
      this.syncFromProps()
      if (this.properties.multiple) return
      if (this.properties.value != null || this.properties.defaultValue == null) return
      const options = normalize(this.properties.options)
      const selected = selectedFrom(this.properties.defaultValue, options)
      const match = options.find((option) => option.value === selected)
      if (!match) return
      this.setData({
        selected: match.value,
        index: options.indexOf(match),
        displayText: match.label,
        optionStatus: this.optionText(match.value, options),
      })
      this.setData({
        className:
          `border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex w-full cursor-pointer appearance-none items-center rounded-md border bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] ${this.properties.extClass}`.trim(),
      })
    },
  },
  observers: {
    'options, value, disabled, multiple': function () {
      this.syncFromProps()
    },
    value() {
      this.syncFromProps()
    },
  },
  methods: {
    optionText(selected: string | string[], options: NativeOption[]) {
      const values = options.map((option) => option.value)
      const picked = (Array.isArray(selected) ? selected : [selected]).filter(
        (item) => item && values.includes(item)
      )
      if (picked.length > 1) return `${picked.length} options selected`
      if (picked.length === 1) return `Option ${values.indexOf(picked[0]) + 1} of ${values.length}`
      return ''
    },
    listedValues(raw: unknown) {
      if (Array.isArray(raw)) return raw.map((item) => String(item))
      if (raw == null || raw === '') return []
      return [String(raw)]
    },
    syncFromProps() {
      const options = normalize(this.properties.options)
      if (this.properties.multiple) {
        const source = this.properties.value == null ? this.properties.defaultValue : this.properties.value
        const picked = this.listedValues(source).filter((value) => options.some((option) => option.value === value))
        this.setData({
          labels: options.map((option) => option.label),
          selected: picked.join(','),
          selectedValues: picked,
          optionRows: options.map((option) => ({ ...option, checked: picked.includes(option.value) })),
          index: 0,
          displayText: options
            .filter((option) => picked.includes(option.value))
            .map((option) => option.label)
            .join(', '),
          optionStatus: this.optionText(picked, options),
        })
        return
      }
      const selected = selectedFrom(this.properties.value, options)
      const match = options.find((option) => option.value === selected)
      this.setData({
        labels: options.map((option) => option.label),
        selected: match?.value ?? '',
        index: match ? options.indexOf(match) : 0,
        displayText: match?.label ?? '',
        optionStatus: this.optionText(match?.value ?? '', options),
      })
    },
    handleChange(e: WechatMiniprogram.CustomEvent<{ value: string | number }>) {
      if (this.properties.disabled) return
      const options = normalize(this.properties.options)
      const index = Number(e.detail?.value)
      const option = options[index]
      if (!option) return
      if (this.properties.value == null) {
        this.setData({
          selected: option.value,
          index,
          displayText: option.label,
          optionStatus: this.optionText(option.value, options),
        })
      }
      emitTimEvent(this, 'change', 'change', this.properties.id || 'select-native', {
        value: option.value,
      })
    },
    onOptionKey(e: WechatMiniprogram.BaseEvent & { detail?: { key?: string } }) {
      const key = String(e?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onOptionTap(e)
    },
    onOptionTap(e: WechatMiniprogram.BaseEvent) {
      if (!this.properties.multiple || this.properties.disabled) return
      const value = String(e.currentTarget?.dataset?.value || '')
      const options = normalize(this.properties.options)
      if (!value || !options.some((option) => option.value === value)) return
      const current = this.data.selectedValues || []
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      if (this.properties.value == null) {
        this.setData({
          selected: next.join(','),
          selectedValues: next,
          optionRows: options.map((option) => ({ ...option, checked: next.includes(option.value) })),
          displayText: options
            .filter((option) => next.includes(option.value))
            .map((option) => option.label)
            .join(', '),
          optionStatus: this.optionText(next, options),
        })
      }
      emitTimEvent(this, 'change', 'change', this.properties.id || 'select-native', {
        value: next,
      })
    },
  },
})
