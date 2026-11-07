import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { FieldSpec, FormSnapshot } from '@timui/core'

type ComponentDefinition = {
  data?: { snapshot?: FormSnapshot | null }
  methods?: Record<string, (event?: Record<string, unknown>) => unknown>
  properties?: Record<string, { value?: unknown }>
  lifetimes?: { attached?: () => void }
}

const fields: FieldSpec[] = [
  {
    name: 'email',
    label: 'Email',
    rules: [
      { kind: 'required', message: 'Email is required' },
      { kind: 'email', message: 'Enter a valid email' },
    ],
  },
  {
    name: 'terms',
    label: 'Terms',
    rules: [{ kind: 'checked', message: 'Accept terms' }],
  },
]

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'form.ts')).href)
  if (!captured) throw new Error('form component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (fieldList: FieldSpec[] = fields, disabled = false) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const submitted: Array<Record<string, string>> = []
  const host = {
    properties: { fields: fieldList, disabled },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
    },
    triggerEvent(_name: string, detail?: { values?: Record<string, string> }) {
      if (detail?.values) submitted.push(detail.values)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return { host: host as typeof host & Record<string, (event?: Record<string, unknown>) => unknown>, submitted }
}

describe('weapp form', () => {
  it('renders an alert for each invalid field', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'form.wxml'), 'utf8')
    expect(markup).toContain('id="{{item.name}}-error"')
    expect(markup).toContain('role="alert"')
    expect(markup).toContain('{{errorSummary}}')
    expect(markup).toContain('aria-invalid="{{item.invalid}}"')
    expect(markup).toContain('aria-required="{{item.required}}"')
    expect(markup).toContain('aria-describedby="{{item.describedBy}}"')
    expect(markup.match(/wx:if="\{\{item\.describedBy\}\}"/g)).toHaveLength(9)
    expect(markup).toContain('aria-required="{{item.required}}">{{item.display || \'Choose\'}}</view>')
    expect(markup.match(/tabindex="\{\{disabled \? -1 : 0\}\}" aria-disabled="\{\{disabled \? 'true' : 'false'\}\}"/g)).toHaveLength(6)
    expect(markup).toContain('bindtap="onSubmit"')
    expect(markup).toContain('<textarea')
    expect(markup).toContain('{{item.textCount}} of {{item.textLimit}}')
    expect(markup).toContain('id="{{item.name}}-hint"')
    expect(markup).toContain('id="{{item.name}}-count"')
    expect(markup).toContain('<switch')
    expect(markup).toContain('mode="selector"')
    expect(markup).toContain("aria-label=\"{{item.label || item.display || 'Choose'}}\"")
    expect(markup).toContain(">{{item.display || 'Choose'}}")
    expect(markup).toContain("aria-label=\"{{item.label || 'Date'}}\"")
    expect(markup).toContain(">{{item.value || 'Date'}}")
    expect(markup).toContain("aria-label=\"{{item.label || 'Time'}}\"")
    expect(markup).toContain(">{{item.value || 'Time'}}")
    expect(markup).toContain('type="number"')
    expect(markup).toContain('password="{{item.control === \'password\' && !item.revealed}}"')
    expect(markup).toContain("aria-label=\"{{item.revealed ? 'Hide password' : 'Show password'}}\"")
    expect(markup).toContain('bindtap="onReveal"')
    expect(markup).toContain('mode="date"')
    expect(markup).toContain('start="{{item.dateStart}}"')
    expect(markup).toContain('end="{{item.dateEnd}}"')
    expect(markup).toContain('mode="time"')
    expect(markup).toContain('start="{{item.timeStart}}"')
    expect(markup).toContain('end="{{item.timeEnd}}"')
    expect(markup).toContain('<radio-group')
    expect(markup).toContain('role="radiogroup"')
    expect(markup).toContain('id="{{item.name}}-label"')
    expect(markup).toContain('aria-labelledby="{{item.name}}-label"')
    expect(markup).not.toContain('aria-label="{{item.label}}"')
    expect(markup).toContain('bindchange="onSelectChange"')
    expect(markup).toContain('for="{{item.name}}"')
    expect(markup).toContain('focus="{{focusName === item.name}}"')
    expect(markup).not.toContain('<text>{{item.label}}</text>')
  })

  it('blocks submit until the fields are valid, then returns the values', async () => {
    const { host, submitted } = await hostFor()
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.fieldProps('email')).toEqual({
      id: 'email',
      'aria-invalid': 'true',
      'aria-describedby': 'email-error',
    })
    expect(host.fieldProps('terms')).toEqual({
      id: 'terms',
      'aria-invalid': 'true',
      'aria-describedby': 'terms-error',
    })
    expect(host.data.snapshot?.errors.email).toBe('Email is required')
    expect(host.data.focusName).toBe('email')
    expect(host.data.snapshot?.errors.terms).toBe('Accept terms')
    expect(host.data.rows?.map((row) => row.required)).toEqual(['true', 'true'])
    expect(host.data.rows?.map((row) => [row.name, row.control, row.error, row.invalid])).toEqual([
      ['email', 'text', 'Email is required', 'true'],
      ['terms', 'check', 'Accept terms', 'true'],
    ])
    expect(submitted).toEqual([])

    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'ada@example.com' } })
    host.onFieldInput({
      mark: { name: 'email' },
      detail: { value: null },
      target: { value: 'ada@example.com' },
    })
    expect(host.data.snapshot?.values.email).toBe('')
    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'ada@example.com' } })
    host.onFieldInput({ mark: { name: 'terms' }, detail: { checked: true } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(host.fieldProps('email')['aria-invalid']).toBeUndefined()
    expect(host.fieldProps('terms')['aria-invalid']).toBeUndefined()
    expect(host.data.rows?.every((row) => row.error === '' && row.invalid === 'false')).toBe(true)
    expect(submitted).toEqual([{ email: 'ada@example.com', terms: 'true' }])
  })

  it('blocks a short name and submits once it has two characters', async () => {
    const { host, submitted } = await hostFor([
      {
        name: 'name',
        label: 'Name',
        rules: [
          { kind: 'required', message: 'Name is required' },
          { kind: 'minLength', min: 2, message: 'Use at least 2 characters' },
        ],
      },
    ])
    host.onFieldInput({ mark: { name: 'name' }, detail: { value: 'A' } })
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.name).toBe('Use at least 2 characters')
    expect(host.fieldProps('name')).toEqual({
      id: 'name',
      'aria-invalid': 'true',
      'aria-describedby': 'name-error',
    })
    host.onFieldInput({ mark: { name: 'name' }, detail: { value: 'Ada' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ name: 'Ada' }])
    expect(host.fieldProps('name')['aria-invalid']).toBeUndefined()
  })

  it('blocks a number outside min and max and submits a number inside', async () => {
    const { host, submitted } = await hostFor([
      {
        name: 'count',
        label: 'Count',
        rules: [
          { kind: 'min', min: 1, message: 'At least 1' },
          { kind: 'max', max: 10, message: 'At most 10' },
        ],
      },
    ])
    expect(host.data.rows?.[0]?.required).toBe('false')
    const empty = host.onSubmit() as { ok: boolean }
    expect(empty.ok).toBe(true)
    host.onFieldInput({ mark: { name: 'count' }, detail: { value: '0' } })
    const low = host.onSubmit() as { ok: boolean }
    expect(low.ok).toBe(false)
    expect(host.data.snapshot?.errors.count).toBe('At least 1')
    expect(host.fieldProps('count')['aria-invalid']).toBe('true')
    host.onFieldInput({ mark: { name: 'count' }, detail: { value: '11' } })
    const high = host.onSubmit() as { ok: boolean }
    expect(high.ok).toBe(false)
    expect(host.data.snapshot?.errors.count).toBe('At most 10')
    host.onFieldInput({ mark: { name: 'count' }, detail: { value: '4' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted.at(-1)).toEqual({ count: '4' })
  })

  it('ignores changes and submit while disabled', async () => {
    const { host, submitted } = await hostFor(
      [{ name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] }],
      true
    )
    host.onFieldInput({ mark: { name: 'name' }, detail: { value: 'Ada' } })
    const result = host.onSubmit()
    expect(result).toBeNull()
    expect(host.data.snapshot?.values.name ?? '').toBe('')
    expect(submitted).toEqual([])
  })

  it('accepts a checkbox change as a value list, then clears it', async () => {
    const { host, submitted } = await hostFor()
    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'ada@example.com' } })
    host.onFieldInput({ mark: { name: 'terms' }, detail: { value: ['true'] } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ email: 'ada@example.com', terms: 'true' }])

    host.onFieldInput({ mark: { name: 'terms' }, detail: { value: [] } })
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.terms).toBe('Accept terms')
    expect(host.data.snapshot?.values.terms).toBe('')
  })

  it('links textarea, select, switch, and number errors, then submits', async () => {
    const extra: Array<FieldSpec & { control?: string; options?: Array<{ label: string; value: string }> }> = [
      { name: 'note', label: 'Note', control: 'textarea', rules: [{ kind: 'required', message: 'Note is required' }] },
      {
        name: 'fruit',
        label: 'Fruit',
        control: 'select',
        options: [{ label: 'Apple', value: 'apple' }],
        rules: [{ kind: 'required', message: 'Fruit is required' }],
      },
      { name: 'alerts', label: 'Alerts', control: 'switch', rules: [{ kind: 'checked', message: 'Enable alerts' }] },
      { name: 'count', label: 'Count', control: 'number', rules: [{ kind: 'required', message: 'Count is required' }] },
    ]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.map((row) => row.control)).toEqual(['textarea', 'select', 'switch', 'number'])
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.fieldProps('note')['aria-describedby']).toBe('note-error')
    expect(host.fieldProps('fruit')['aria-describedby']).toBe('fruit-error')
    expect(host.fieldProps('alerts')['aria-invalid']).toBe('true')
    expect(host.fieldProps('count')['aria-describedby']).toBe('count-error')
    host.onFieldInput({ mark: { name: 'note' }, detail: { value: 'hello' } })
    host.onSelectChange({ mark: { name: 'fruit' }, detail: { value: 0 } })
    host.onFieldInput({ mark: { name: 'alerts' }, detail: { value: true } })
    host.onFieldInput({ mark: { name: 'count' }, detail: { value: '3' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ note: 'hello', fruit: 'apple', alerts: 'true', count: '3' }])
    expect(host.fieldProps('note')['aria-invalid']).toBeUndefined()
    expect(host.fieldProps('count')['aria-invalid']).toBeUndefined()
  })

  it('keeps a required radio empty until one option is chosen', async () => {
    const extra = [
      {
        name: 'plan',
        label: 'Plan',
        control: 'radio',
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Pro', value: 'pro' },
        ],
        rules: [{ kind: 'required', message: 'Choose a plan' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.[0]?.control).toBe('radio')
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.plan).toBe('Choose a plan')
    expect(host.data.focusName).toBe('plan')
    host.onFieldInput({ mark: { name: 'plan' }, detail: { value: 'pro' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ plan: 'pro' }])
    const locked = await hostFor(extra, true)
    locked.host.onFieldInput({ mark: { name: 'plan' }, detail: { value: 'pro' } })
    expect(locked.host.data.snapshot?.values.plan).toBe('')
  })

  it('accepts a password and keeps an invalid email', async () => {
    const extra = [
      {
        name: 'email',
        label: 'Email',
        rules: [{ kind: 'email', message: 'Enter a valid email' }],
      },
      {
        name: 'secret',
        label: 'Secret',
        control: 'password',
        rules: [{ kind: 'required', message: 'Secret is required' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.map((row) => row.control)).toEqual(['text', 'password'])
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.focusName).toBe('secret')
    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'not-an-email' } })
    host.onFieldInput({ mark: { name: 'secret' }, detail: { value: 's3cret' } })
    const invalid = host.onSubmit() as { ok: boolean }
    expect(invalid.ok).toBe(false)
    expect(host.data.snapshot?.errors.email).toBe('Enter a valid email')
    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'ada@example.com' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ email: 'ada@example.com', secret: 's3cret' }])
  })

  it('reveals a password field and masks it again', async () => {
    const extra = [{ name: 'secret', label: 'Secret', control: 'password' }] as FieldSpec[]
    const { host } = await hostFor(extra)
    expect(host.data.rows?.[0]?.revealed).toBe(false)
    host.onReveal({ mark: { name: 'secret' } })
    expect(host.data.rows?.[0]?.revealed).toBe(true)
    expect(host.data.focusName).toBe('secret')
    host.onReveal({ mark: { name: 'secret' } })
    expect(host.data.rows?.[0]?.revealed).toBe(false)
    const locked = await hostFor(extra, true)
    locked.host.onReveal({ mark: { name: 'secret' } })
    expect(locked.host.data.rows?.[0]?.revealed).toBe(false)
    expect(locked.host.data.focusName).toBe('')
  })

  it('keeps a required date empty until a day is chosen', async () => {
    const extra = [
      {
        name: 'day',
        label: 'Day',
        control: 'date',
        rules: [{ kind: 'required', message: 'Choose a day' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.[0]?.control).toBe('date')
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.day).toBe('Choose a day')
    expect(host.data.focusName).toBe('day')
    host.onFieldInput({ mark: { name: 'day' }, detail: { value: '2026-11-07' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ day: '2026-11-07' }])
    const locked = await hostFor(extra, true)
    locked.host.onFieldInput({ mark: { name: 'day' }, detail: { value: '2026-11-07' } })
    expect(locked.host.data.snapshot?.values.day).toBe('')
  })

  it('keeps a required time empty until a time is chosen', async () => {
    const extra = [
      {
        name: 'when',
        label: 'When',
        control: 'time',
        rules: [{ kind: 'required', message: 'Choose a time' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.[0]?.control).toBe('time')
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.when).toBe('Choose a time')
    expect(host.data.focusName).toBe('when')
    host.onFieldInput({ mark: { name: 'when' }, detail: { value: '09:30' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ when: '09:30' }])
    const locked = await hostFor(extra, true)
    locked.host.onFieldInput({ mark: { name: 'when' }, detail: { value: '09:30' } })
    expect(locked.host.data.snapshot?.values.when).toBe('')
  })

  it('blocks a day or time outside its bounds and allows an empty optional value', async () => {
    const extra = [
      {
        name: 'day',
        label: 'Day',
        control: 'date',
        rules: [{ kind: 'dateMin', min: '2026-11-07', message: 'Too early' }],
      },
      {
        name: 'when',
        label: 'When',
        control: 'time',
        rules: [{ kind: 'timeMax', max: '17:00', message: 'Too late' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.[0]?.dateStart).toBe('2026-11-07')
    expect(host.data.rows?.[1]?.timeEnd).toBe('17:00')
    const empty = host.onSubmit() as { ok: boolean }
    expect(empty.ok).toBe(true)
    expect(submitted).toEqual([{ day: '', when: '' }])
    host.onFieldInput({ mark: { name: 'day' }, detail: { value: '2026-11-06' } })
    const early = host.onSubmit() as { ok: boolean }
    expect(early.ok).toBe(false)
    expect(host.data.snapshot?.errors.day).toBe('Too early')
    expect(host.data.focusName).toBe('day')
    host.onFieldInput({ mark: { name: 'day' }, detail: { value: '2026-11-07' } })
    host.onFieldInput({ mark: { name: 'when' }, detail: { value: '17:30' } })
    const late = host.onSubmit() as { ok: boolean }
    expect(late.ok).toBe(false)
    expect(host.data.snapshot?.errors.when).toBe('Too late')
    host.onFieldInput({ mark: { name: 'when' }, detail: { value: '17:00' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([
      { day: '', when: '' },
      { day: '2026-11-07', when: '17:00' },
    ])
  })

  it('blocks a value that misses its pattern and allows an empty optional pattern', async () => {
    const extra = [
      {
        name: 'code',
        label: 'Code',
        rules: [{ kind: 'pattern', pattern: '^[A-Z]{3}$', message: 'Use three letters' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    const empty = host.onSubmit() as { ok: boolean }
    expect(empty.ok).toBe(true)
    expect(submitted).toEqual([{ code: '' }])
    host.onFieldInput({ mark: { name: 'code' }, detail: { value: 'ab' } })
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.code).toBe('Use three letters')
    expect(host.data.focusName).toBe('code')
    host.onFieldInput({ mark: { name: 'code' }, detail: { value: 'ABC' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ code: '' }, { code: 'ABC' }])
  })

  it('blocks a confirmation that differs and checks it again when the other field changes', async () => {
    const extra = [
      { name: 'secret', label: 'Secret' },
      {
        name: 'confirm',
        label: 'Confirm',
        rules: [{ kind: 'same', field: 'secret', message: 'Must match' }],
      },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    const empty = host.onSubmit() as { ok: boolean }
    expect(empty.ok).toBe(true)
    expect(submitted).toEqual([{ secret: '', confirm: '' }])
    host.onFieldInput({ mark: { name: 'confirm' }, detail: { value: 'no' } })
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.snapshot?.errors.confirm).toBe('Must match')
    expect(host.data.focusName).toBe('confirm')
    host.onFieldInput({ mark: { name: 'secret' }, detail: { value: 's3cret' } })
    host.onFieldInput({ mark: { name: 'confirm' }, detail: { value: 's3cret' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([
      { secret: '', confirm: '' },
      { secret: 's3cret', confirm: 's3cret' },
    ])
    host.onFieldInput({ mark: { name: 'secret' }, detail: { value: 'other' } })
    expect(host.data.snapshot?.errors.confirm).toBe('Must match')
  })

  it('describes a hint while the field is valid and keeps it with the error', async () => {
    const extra = [
      {
        name: 'note',
        label: 'Note',
        hint: 'Use letters',
        rules: [
          { kind: 'required', message: 'Required' },
          { kind: 'maxLength', max: 4, message: 'Too long' },
        ],
      },
    ] as FieldSpec[]
    const { host } = await hostFor(extra)
    expect(host.data.rows?.[0]?.hint).toBe('Use letters')
    expect(host.data.rows?.[0]?.describedBy).toBe('note-hint note-count')
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.rows?.[0]?.hint).toBe('Use letters')
    expect(host.data.rows?.[0]?.describedBy).toBe('note-error note-hint note-count')
    expect(host.data.rows?.[0]?.error).toBe('Required')
  })

  it('cuts a form field to maxLength and reads the character count', async () => {
    const extra = [
      { name: 'note', label: 'Note', rules: [{ kind: 'maxLength', max: 4, message: 'Too long' }] },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.rows?.[0]?.textLimit).toBe(4)
    expect(host.data.rows?.[0]?.textCount).toBe(0)
    expect(host.data.rows?.[0]?.describedBy).toBe('note-count')
    const empty = host.onSubmit() as { ok: boolean }
    expect(empty.ok).toBe(true)
    host.onFieldInput({ mark: { name: 'note' }, detail: { value: 'pineapple' } })
    expect(host.data.snapshot?.values.note).toBe('pine')
    expect(host.data.rows?.[0]?.textCount).toBe(4)
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ note: '' }, { note: 'pine' }])
  })

  it('announces how many fields need attention after a failed submit', async () => {
    const extra = [
      { name: 'email', label: 'Email', rules: [{ kind: 'required', message: 'Email is required' }] },
      { name: 'name', label: 'Name', rules: [{ kind: 'required', message: 'Name is required' }] },
    ] as FieldSpec[]
    const { host, submitted } = await hostFor(extra)
    expect(host.data.errorSummary ?? '').toBe('')
    const blocked = host.onSubmit() as { ok: boolean }
    expect(blocked.ok).toBe(false)
    expect(host.data.errorSummary).toBe('2 fields need attention: Email, Name')
    host.onFieldInput({ mark: { name: 'name' }, detail: { value: 'Ada' } })
    expect(host.data.errorSummary).toBe('1 field needs attention: Email')
    host.onFieldInput({ mark: { name: 'email' }, detail: { value: 'ada@example.com' } })
    const sent = host.onSubmit() as { ok: boolean }
    expect(sent.ok).toBe(true)
    expect(submitted).toEqual([{ email: 'ada@example.com', name: 'Ada' }])
    expect(host.data.errorSummary).toBe('')
  })
})
