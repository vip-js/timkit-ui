import {
  createForm,
  fieldA11y,
  fieldDateBound,
  fieldMaxLength,
  fieldRequired,
  fieldTimeBound,
  firstInvalidField,
  formErrorSummary,
  readFieldValue,
  setFieldValue,
  submitForm,
  type FieldSpec,
  type FormSnapshot,
} from '@timui/core'

export {
  createControl,
  createForm,
  fieldA11y,
  reduceControl,
  reduceTableKey,
  reduceWidgetKey,
  restoreFocus,
  setFieldValue,
  sortRows,
  submitForm,
} from '@timui/core'

type FormEvent = {
  mark?: { name?: string }
  currentTarget?: { dataset?: { name?: string } }
  detail?: { value?: unknown; checked?: unknown }
  target?: { value?: unknown; checked?: unknown }
}

type WeappField = FieldSpec & {
  control?: 'text' | 'textarea' | 'select' | 'switch' | 'number' | 'check' | 'radio' | 'password' | 'date' | 'time'
  options?: Array<{ label?: string; value: string }>
}

const fieldsOf = (host: { properties?: { fields?: FieldSpec[] } }) =>
  (host.properties?.fields ?? []) as WeappField[]

const controlOf = (field: WeappField) => {
  if (field.control) return field.control
  if ((field.rules ?? []).some((rule) => rule.kind === 'checked')) return 'check' as const
  return 'text' as const
}

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    fields: { type: Array, value: [] },
    disabled: { type: Boolean, value: false },
    extClass: { type: String, value: '' },
  },

  data: {
    snapshot: null as FormSnapshot | null,
    focusName: '',
    revealedNames: [] as string[],
    rows: [] as Array<{
      name: string
      label: string
      value: string
      checked: boolean
      error: string
      invalid: string
      describedBy: string
      required: string
      control: 'check' | 'text' | 'textarea' | 'select' | 'switch' | 'number' | 'radio' | 'password' | 'date' | 'time'
      options: Array<{ label?: string; value: string }>
      optionLabels: string[]
      optionIndex: number
      display: string
    }>,
  },

  lifetimes: {
    attached() {
      this.paint(createForm(fieldsOf(this)))
    },
  },

  methods: {
    paint(snapshot: FormSnapshot, focusName = '') {
      const rows = fieldsOf(this).map((field) => {
        const error = snapshot.errors[field.name] ?? ''
        const value = snapshot.values[field.name] ?? ''
        const control = controlOf(field)
        const textLimit = fieldMaxLength(field.rules) ?? -1
        const counted = textLimit >= 0 && (control === 'text' || control === 'password' || control === 'textarea')
        const options = field.options ?? []
        const selected = options.find((option) => option.value === value)
        const optionIndex = options.findIndex((option) => option.value === value)
        return {
          name: field.name,
          label: field.label,
          value,
          checked: value === 'true',
          error,
          invalid: error ? 'true' : 'false',
          describedBy: [fieldA11y(field.name, error, field.hint)['aria-describedby'], counted ? `${field.name}-count` : '']
            .filter(Boolean)
            .join(' '),
          hint: field.hint?.trim() ?? '',
          required: fieldRequired(field.rules) ? 'true' : 'false',
          control,
          options,
          optionLabels: options.map((option) => option.label || option.value),
          optionIndex: optionIndex < 0 ? 0 : optionIndex,
          display: selected?.label || selected?.value || '',
          dateStart: fieldDateBound(field.rules, 'min') ?? '',
          dateEnd: fieldDateBound(field.rules, 'max') ?? '',
          timeStart: fieldTimeBound(field.rules, 'min') ?? '',
          timeEnd: fieldTimeBound(field.rules, 'max') ?? '',
          revealed: (this.data.revealedNames ?? []).includes(field.name),
          textLimit,
          textCount: value.length,
        }
      })
      this.setData({
        snapshot,
        rows,
        focusName,
        errorSummary: formErrorSummary(fieldsOf(this), snapshot.errors, snapshot.submitCount),
      })
    },
    onSelectChange(event?: FormEvent) {
      if (this.properties.disabled) return
      const fields = fieldsOf(this)
      const name = String(event?.mark?.name || event?.currentTarget?.dataset?.name || '')
      const field = fields.find((item) => item.name === name)
      if (!field) return
      const index = Number(event?.detail?.value)
      const value = field.options?.[index]?.value ?? ''
      const snapshot = this.data.snapshot ?? createForm(fields)
      this.paint(setFieldValue(snapshot, name, value, fields))
    },
    onFieldInput(event?: FormEvent) {
      if (this.properties.disabled) return
      const fields = fieldsOf(this)
      const name = String(event?.mark?.name || event?.currentTarget?.dataset?.name || '')
      if (!name) return
      const snapshot = this.data.snapshot ?? createForm(fields)
      this.paint(setFieldValue(snapshot, name, readFieldValue(event), fields))
    },
    fieldProps(name: string) {
      const error = this.data.snapshot?.errors?.[name]
      const hint = fieldsOf(this).find((field) => field.name === name)?.hint
      return fieldA11y(name, error, hint)
    },
    onReveal(event?: FormEvent) {
      if (this.properties.disabled) return
      const name = String(event?.mark?.name || event?.currentTarget?.dataset?.name || '')
      const field = fieldsOf(this).find((item) => item.name === name)
      if (!field || controlOf(field) !== 'password') return
      const names = this.data.revealedNames ?? []
      const revealedNames = names.includes(name) ? names.filter((item) => item !== name) : [...names, name]
      this.setData({ revealedNames })
      const snapshot = this.data.snapshot ?? createForm(fieldsOf(this))
      this.paint(snapshot, '')
      this.paint(snapshot, name)
    },
    onRevealKey(event?: FormEvent & { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onReveal(event)
    },
    onSubmit() {
      if (this.properties.disabled) return null
      const fields = fieldsOf(this)
      const result = submitForm(this.data.snapshot ?? createForm(fields), fields)
      const focusName = result.ok ? '' : firstInvalidField(fields, result.snapshot.errors)
      this.paint(result.snapshot, focusName)
      if (result.ok) this.triggerEvent('submit', { values: result.values })
      return result
    },
  },
})
