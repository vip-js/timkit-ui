export type FieldRule =
  | { kind: 'required'; message: string }
  | { kind: 'email'; message: string }
  | { kind: 'minLength'; min: number; message: string }
  | { kind: 'maxLength'; max: number; message: string }
  | { kind: 'min'; min: number; message: string }
  | { kind: 'max'; max: number; message: string }
  | { kind: 'checked'; message: string }
  | { kind: 'pattern'; pattern: string; message: string }
  | { kind: 'same'; field: string; message: string }
  | { kind: 'dateMin'; min: string; message: string }
  | { kind: 'dateMax'; max: string; message: string }
  | { kind: 'timeMin'; min: string; message: string }
  | { kind: 'timeMax'; max: string; message: string }

export type FieldSpec = {
  name: string
  label: string
  hint?: string
  control?: 'text' | 'textarea' | 'select' | 'switch' | 'number' | 'check' | 'radio' | 'password' | 'date' | 'time'
  options?: Array<{ label?: string; value: string }>
  rules?: FieldRule[]
}

export type FormValues = Record<string, string>

export type FormSnapshot = {
  values: FormValues
  errors: FormValues
  submitCount: number
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const calendarDay = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

const clockTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const fieldMaxLength = (rules: FieldRule[] = []) => {
  const rule = rules.find((item) => item.kind === 'maxLength' && item.max >= 0)
  return rule?.kind === 'maxLength' ? rule.max : undefined
}

export const fieldPattern = (rules: FieldRule[] = []) => {
  const rule = rules.find((item) => item.kind === 'pattern' && item.pattern)
  return rule?.kind === 'pattern' ? rule.pattern : undefined
}

export const fieldDateBound = (rules: FieldRule[] = [], edge: 'min' | 'max') => {
  const rule = rules.find((item) => item.kind === (edge === 'min' ? 'dateMin' : 'dateMax'))
  if (!rule || (rule.kind !== 'dateMin' && rule.kind !== 'dateMax')) return undefined
  const bound = rule.kind === 'dateMin' ? rule.min : rule.max
  return calendarDay(bound) ? bound : undefined
}

export const fieldTimeBound = (rules: FieldRule[] = [], edge: 'min' | 'max') => {
  const rule = rules.find((item) => item.kind === (edge === 'min' ? 'timeMin' : 'timeMax'))
  if (!rule || (rule.kind !== 'timeMin' && rule.kind !== 'timeMax')) return undefined
  const bound = rule.kind === 'timeMin' ? rule.min : rule.max
  return clockTime(bound) ? bound : undefined
}

export const fieldError = (value: string, rules: FieldRule[] = [], values: FormValues = {}) => {
  for (const rule of rules) {
    if (rule.kind === 'required' && value.trim() === '') return rule.message
    if (rule.kind === 'email' && value.trim() !== '' && !emailPattern.test(value.trim())) {
      return rule.message
    }
    if (rule.kind === 'minLength' && value.trim().length < rule.min) return rule.message
    if (rule.kind === 'maxLength' && value.length > rule.max) return rule.message
    if (rule.kind === 'min' || rule.kind === 'max') {
      if (value.trim() === '') continue
      const numeric = Number(value)
      if (!Number.isFinite(numeric)) return rule.message
      if (rule.kind === 'min' && numeric < rule.min) return rule.message
      if (rule.kind === 'max' && numeric > rule.max) return rule.message
    }
    if (rule.kind === 'checked' && value !== 'true') return rule.message
    if (rule.kind === 'pattern') {
      if (value === '') continue
      try {
        if (!new RegExp(`^(?:${rule.pattern})$`).test(value)) return rule.message
      } catch {
        return rule.message
      }
    }
    if (rule.kind === 'same' && value !== (values[rule.field] ?? '')) return rule.message
    if (rule.kind === 'dateMin' || rule.kind === 'dateMax') {
      if (value.trim() === '') continue
      const bound = rule.kind === 'dateMin' ? rule.min : rule.max
      if (!calendarDay(value) || !calendarDay(bound)) return rule.message
      if (rule.kind === 'dateMin' && value < bound) return rule.message
      if (rule.kind === 'dateMax' && value > bound) return rule.message
    }
    if (rule.kind === 'timeMin' || rule.kind === 'timeMax') {
      if (value.trim() === '') continue
      const bound = rule.kind === 'timeMin' ? rule.min : rule.max
      if (!clockTime(value) || !clockTime(bound)) return rule.message
      if (rule.kind === 'timeMin' && value < bound) return rule.message
      if (rule.kind === 'timeMax' && value > bound) return rule.message
    }
  }
  return ''
}

type FormEventValue = string | number | boolean | null | Array<string | number | boolean | null>
type FormEventRecord = {
  detail?: { value?: FormEventValue; checked?: boolean }
  target?: { value?: string; checked?: boolean; type?: string } | EventTarget | null
}
export type FormEvent =
  | string
  | number
  | boolean
  | FormEventRecord
  | Event

export const readFieldValue = (event: FormEvent) => {
  if (typeof event === 'string') return event
  if (typeof event === 'number' && Number.isFinite(event)) return String(event)
  if (typeof event === 'boolean') return event ? 'true' : ''
  if (!event || typeof event !== 'object') return ''
  const record = event
  const detail = 'detail' in record ? record.detail : undefined
  if (detail && typeof detail === 'object') {
    const payload = detail
    if ('value' in payload) {
      if (Array.isArray(payload.value)) return String(payload.value[0] ?? '')
      if (payload.value == null) return ''
      if (typeof payload.value === 'boolean') return payload.value ? 'true' : ''
      if (typeof payload.value === 'string' || typeof payload.value === 'number') return String(payload.value)
    }
    if (typeof payload.checked === 'boolean') return payload.checked ? 'true' : ''
  }
  const target = 'target' in record ? record.target : undefined
  if (!target || typeof target !== 'object') return ''
  const targetRecord = target as { value?: string; checked?: boolean; type?: string }
  if (targetRecord.type === 'radio') {
    if (targetRecord.checked === false) return ''
    return typeof targetRecord.value === 'string' ? targetRecord.value : ''
  }
  if (targetRecord.type === 'checkbox' && typeof targetRecord.checked === 'boolean') {
    return targetRecord.checked ? 'true' : ''
  }
  if (typeof targetRecord.value === 'string') return targetRecord.value
  return ''
}

export const createForm = (fields: FieldSpec[], initial: FormValues = {}): FormSnapshot => {
  const values: FormValues = {}
  for (const field of fields) values[field.name] = initial[field.name] ?? ''
  return { values, errors: {}, submitCount: 0 }
}

export const setFieldValue = (
  snapshot: FormSnapshot,
  name: string,
  value: string,
  fields: FieldSpec[]
): FormSnapshot => {
  const field = fields.find((item) => item.name === name)
  const max = fieldMaxLength(field?.rules)
  const stored = max === undefined || value.length <= max ? value : value.slice(0, max)
  const values = { ...snapshot.values, [name]: stored }
  const errors = { ...snapshot.errors }
  const affected = fields.filter(
    (field) =>
      field.name === name ||
      field.rules?.some((rule) => rule.kind === 'same' && rule.field === name)
  )
  for (const field of affected) {
    const message = fieldError(values[field.name] ?? '', field.rules, values)
    if (message) errors[field.name] = message
    else delete errors[field.name]
  }
  return { ...snapshot, values, errors }
}

export const submitForm = (snapshot: FormSnapshot, fields: FieldSpec[]) => {
  const errors: FormValues = {}
  for (const field of fields) {
    const message = fieldError(snapshot.values[field.name] ?? '', field.rules, snapshot.values)
    if (message) errors[field.name] = message
  }
  const next: FormSnapshot = {
    values: snapshot.values,
    errors,
    submitCount: snapshot.submitCount + 1,
  }
  if (Object.keys(errors).length > 0) return { ok: false as const, snapshot: next }
  return { ok: true as const, snapshot: next, values: { ...snapshot.values } }
}

export const firstInvalidField = (fields: FieldSpec[], errors: FormValues) =>
  fields.find((field) => errors[field.name])?.name ?? ''

export const formErrorSummary = (fields: FieldSpec[], errors: FormValues, submitCount: number) => {
  if (submitCount < 1) return ''
  const invalid = fields.filter((field) => errors[field.name])
  if (invalid.length === 0) return ''
  const count = invalid.length === 1 ? '1 field needs attention' : `${invalid.length} fields need attention`
  return `${count}: ${invalid.map((field) => field.label).join(', ')}`
}

export const fieldRequired = (rules: FieldRule[] = []) =>
  rules.some((rule) => rule.kind === 'required' || rule.kind === 'checked')

export const fieldDescribedBy = (name: string, error?: string, hint?: string) => {
  const ids = [error ? `${name}-error` : '', hint?.trim() ? `${name}-hint` : ''].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

export const fieldA11y = (name: string, error?: string, hint?: string) => ({
  id: name,
  'aria-invalid': error ? ('true' as const) : undefined,
  'aria-describedby': fieldDescribedBy(name, error, hint),
})
