import { emitTimEvent, inputVariants } from '../utils'
import {
  createWeappBaseProps,
  createWeappOptions,
  WEAPP_EXTERNAL_CLASSES,
} from '../utils/component'

type WeappInputDetail = {
  value: string
}

type WeappInputEvent = WechatMiniprogram.CustomEvent<WeappInputDetail>

const nativeInputType = (type: unknown) => {
  if (type === 'number' || type === 'digit' || type === 'idcard' || type === 'nickname') return type
  return 'text'
}

const limitedText = (value: string, max: unknown) => {
  const length = Number(max)
  if (!Number.isFinite(length) || length < 0) return value
  return value.length <= length ? value : value.slice(0, length)
}

Component({
  options: createWeappOptions({ pureData: true }),

  externalClasses: WEAPP_EXTERNAL_CLASSES,

  properties: {
    value: { type: null, value: null },
    defaultValue: { type: String, value: '' },
    type: { type: String, value: 'text' },
    placeholder: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    maxlength: { type: Number, value: -1 },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
    invalid: { type: null, value: null },
    describedBy: { type: null, value: null },
    'aria-label': { type: String, value: '' },
    ...createWeappBaseProps('input'),
  },

  data: {
    className: '',
    current: '',
    count: 0,
    nativeType: 'text',
    masked: false,
    revealed: false,
    revealStatus: '',
    returnFocus: false,
    ariaLabel: '',
    described: '',
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
    type() {
      this.updateClassName()
    },
    extClass() {
      this.updateClassName()
    },
    'aria-label'(next: string) {
      const ariaLabel = String(next || '')
      if (ariaLabel === this.data.ariaLabel) return
      this.setData({ ariaLabel })
    },
    value(val: string) {
      if (val == null) return
      const next = String(val)
      if (next !== this.data.current) this.setData({ current: next, count: next.length })
    },
    'maxlength, type, describedBy, id'() {
      const described = this.describedText()
      if (described !== this.data.described) this.setData({ described })
    },
    maxlength(max: number) {
      const next = limitedText(String(this.data.current ?? ''), max)
      if (next === this.data.current) return
      if (this.properties.value == null) this.setData({ current: next, count: next.length })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'input', { value: next })
    },
  },

  methods: {
    describedText() {
      const id = String(this.properties.id || 'input')
      const passed = this.properties.describedBy ? String(this.properties.describedBy) : ''
      const counted = Number(this.properties.maxlength) >= 0 && this.properties.type !== 'file'
      return [passed, counted ? `${id}-count` : ''].filter(Boolean).join(' ')
    },
    updateClassName() {
      // Use core package's inputVariants for consistent styling
      const { baseClass } = inputVariants({
        type: this.properties.type === 'search' ? 'search' : 'default',
        className: this.properties.extClass,
      })

      this.setData({
        className: baseClass,
        nativeType: nativeInputType(this.properties.type),
        masked: this.properties.type === 'password' && !this.data.revealed,
        revealStatus: this.properties.type === 'password' && this.data.revealed ? 'Visible' : '',
      })
    },

    onInput(e: WeappInputEvent) {
      if (this.properties.disabled || this.properties.readOnly) return this.data.current
      const next = limitedText(String(e.detail?.value ?? ''), this.properties.maxlength)
      if (this.properties.value == null) this.setData({ current: next, count: next.length })
      this.triggerEvent('input', e.detail)
      emitTimEvent(this, 'change', 'change', this.properties.id || 'input', {
        value: next,
      })
      return this.properties.value == null ? next : this.data.current
    },
    onFocus(e: WeappInputEvent) {
      this.triggerEvent('focus', e.detail)
    },
    onBlur(e: WeappInputEvent) {
      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e: WeappInputEvent) {
      this.triggerEvent('confirm', e.detail)
    },
    onClear() {
      if (this.properties.disabled || this.properties.readOnly || this.properties.type === 'file') return
      if (!String(this.data.current ?? '')) return
      const cleared = this.properties.value == null ? { current: '', count: 0 } : {}
      this.setData({ ...cleared, returnFocus: false })
      this.setData({ returnFocus: true })
      emitTimEvent(this, 'change', 'change', this.properties.id || 'input', { value: '' })
    },
    onClearKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onClear()
    },
    onReveal() {
      if (this.properties.disabled || this.properties.type !== 'password') return
      const revealed = !this.data.revealed
      this.setData({
        revealed,
        masked: !revealed,
        revealStatus: revealed ? 'Visible' : '',
        returnFocus: false,
      })
      this.setData({ returnFocus: true })
    },
    onRevealKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onReveal()
    },
  },
})
