import { emitTimEvent, textareaVariants } from '../utils'

type WeappTextareaDetail = {
  value: string
}

type WeappTextareaEvent = WechatMiniprogram.CustomEvent<WeappTextareaDetail>

const limitedText = (value: string, max: unknown) => {
  const length = Number(max)
  if (!Number.isFinite(length) || length < 0) return value
  return value.length <= length ? value : value.slice(0, length)
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: String, value: '' },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    maxlength: { type: Number, value: -1 },
    autoHeight: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    'aria-label': { type: String, value: '' },
    id: { type: String, value: 'textarea' },
    extClass: { type: String, value: '' },
  },

  data: {
    className: '',
    current: '',
    count: 0,
    ariaLabel: '',
    described: '',
    returnFocus: false,
  },

  lifetimes: {
    attached() {
      this.updateClassName()
      const initial = this.properties.value != null ? this.properties.value : this.properties.defaultValue
      const current = String(initial ?? '')
      this.setData({
        current,
        count: current.length,
        ariaLabel: String(this.properties['aria-label'] || ''),
        described: this.describedText(),
      })
    },
  },

  observers: {
    extClass: function () {
      this.updateClassName()
    },
    'aria-label': function (next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    value(val: string) {
      if (val == null) return
      const next = String(val)
      if (next !== this.data.current) this.setData({ current: next, count: next.length })
    },
    'maxlength, describedBy, id'() {
      const described = this.describedText()
      if (described !== this.data.described) this.setData({ described })
    },
    maxlength(max: number) {
      const next = limitedText(String(this.data.current ?? ''), max)
      if (next === this.data.current) return
      if (this.properties.value == null) this.setData({ current: next, count: next.length })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'textarea', { value: next })
    },
  },

  methods: {
    describedText() {
      const id = String(this.properties.id || 'textarea')
      const passed = this.properties.describedBy ? String(this.properties.describedBy) : ''
      const counted = Number(this.properties.maxlength) >= 0
      return [passed, counted ? `${id}-count` : ''].filter(Boolean).join(' ')
    },
    updateClassName() {
      // Use core package's textareaVariants for consistent styling
      const { baseClass } = textareaVariants({
        className: this.properties.extClass,
      })

      this.setData({ className: baseClass })
    },

    onInput(e: WeappTextareaEvent) {
      if (this.properties.disabled || this.properties.readOnly) return this.data.current
      const next = limitedText(String(e.detail?.value ?? ''), this.properties.maxlength)
      if (this.properties.value == null) this.setData({ current: next, count: next.length })
      this.triggerEvent('input', e.detail)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'textarea', {
        value: next,
      })
      return this.properties.value == null ? next : this.data.current
    },
    onFocus(e: WeappTextareaEvent) {
      this.triggerEvent('focus', e.detail)
    },
    onBlur(e: WeappTextareaEvent) {
      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e: WeappTextareaEvent) {
      this.triggerEvent('confirm', e.detail)
    },
    onClear() {
      if (this.properties.disabled || this.properties.readOnly) return
      if (!String(this.data.current ?? '')) return
      const cleared = this.properties.value == null ? { current: '', count: 0 } : {}
      this.setData({ ...cleared, returnFocus: false })
      this.setData({ returnFocus: true })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'textarea', { value: '' })
    },
    onClearKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onClear()
    },
  },
})
