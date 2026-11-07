import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: string; revealStatus?: string }
  methods?: Record<string, (event?: { detail?: { value?: string } }) => string | void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const loaded = new Map<string, ComponentDefinition>()

const load = async (file: string) => {
  const cached = loaded.get(file)
  if (cached) return cached
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, file)).href)
  if (!captured) throw new Error(`${file} was not registered`)
  loaded.set(file, captured)
  return captured
}

const hostFor = (definition: ComponentDefinition, properties: Record<string, unknown> = {}) => {
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail?: { detail?: { value?: string } } }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    events,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail?: { detail?: { value?: string } }) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onInput: (event?: { detail?: { value?: string } }) => string | void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp text input', () => {
  it('links an invalid field to its error', () => {
    const input = fs.readFileSync(path.join(__dirname, 'input.wxml'), 'utf8')
    const area = fs.readFileSync(path.join(__dirname, '../textarea/textarea.wxml'), 'utf8')
    const box = fs.readFileSync(path.join(__dirname, '../checkbox/checkbox.wxml'), 'utf8')
    expect(box).toContain('bindkeydown="onKey"')
    expect(input).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(area).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(input).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(area).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(input).toContain('wx:if="{{ariaLabel && described}}"')
    expect(input).toContain('wx:elif="{{ariaLabel}}"')
    expect(input).toContain('aria-label="{{ariaLabel}}"')
    expect(input).toContain('wx:else')
    expect(input).toContain('aria-label="Clear"')
    expect(input).toContain('{{count}} of {{maxlength}}')
    expect(area).toContain('{{count}} of {{maxlength}}')
    expect(input).toContain("aria-label=\"{{revealed ? 'Hide password' : 'Show password'}}\"")
    expect(input).toContain('bindtap="onReveal"')
    expect(area).toContain('wx:if="{{ariaLabel && described}}"')
    expect(area).toContain('wx:elif="{{ariaLabel}}"')
    expect(area).toContain('aria-label="{{ariaLabel}}"')
    expect(area).toContain('wx:else')
    expect(area).toContain('aria-label="Clear"')
    expect(input).toContain('disabled="{{disabled}}"')
    expect(area).toContain('disabled="{{disabled}}"')
    for (const markup of [input, area, box]) {
      expect(markup).toContain("aria-invalid=\"{{invalid === true || invalid === 'true' ? 'true' : 'false'}}\"")
    }
    expect(box).toContain('aria-describedby="{{describedBy}}"')
    expect(box).not.toContain("aria-describedby=\"{{describedBy || ''}}\"")
    expect(input).toContain('wx:elif="{{described}}"')
    expect(input).toContain('aria-describedby="{{described}}"')
    expect(input.split('wx:else')[1]).not.toContain('aria-describedby')
    expect(area).toContain('wx:elif="{{described}}"')
    expect(area).toContain('aria-describedby="{{described}}"')
    expect(area.split('wx:else')[1]).not.toContain('aria-describedby')
    expect(input).toContain('focus="{{focus || returnFocus}}"')
    expect(area).toContain('focus="{{focus || returnFocus}}"')
    expect(input).toContain('id="{{id}}-count"')
    expect(area).toContain('id="{{id}}-count"')
  })

  it('stores typed text and ignores disabled or read-only changes', async () => {
    const input = await load('input.ts')
    const enabled = hostFor(input, { defaultValue: 'apple' })
    expect(enabled.data.current).toBe('apple')
    enabled.onInput({ detail: { value: 'pear' } })
    expect(enabled.data.current).toBe('pear')
    expect(enabled.events.at(-1)?.detail?.detail?.value).toBe('pear')
    enabled.onClear()
    expect(enabled.data.current).toBe('')
    expect(enabled.data.returnFocus).toBe(true)
    expect(enabled.events.at(-1)?.detail?.detail?.value).toBe('')
    const locked = hostFor(input, { defaultValue: 'apple', disabled: true })
    locked.onClear()
    expect(locked.data.current).toBe('apple')
    expect(locked.data.returnFocus).toBe(false)
    const file = hostFor(input, { defaultValue: 'apple', type: 'file' })
    file.onClear()
    expect(file.data.current).toBe('apple')
    expect(file.data.returnFocus).toBe(false)

    const controlled = hostFor(input, { value: 'apple' })
    controlled.onInput({ detail: { value: 'pear' } })
    expect(controlled.data.current).toBe('apple')
    expect(controlled.events.at(-1)?.detail?.detail?.value).toBe('pear')
    controlled.setProperty('value', 'pear')
    expect(controlled.data.current).toBe('pear')

    const area = await load('../textarea/textarea.ts')
    const controlledArea = hostFor(area, { value: 'note' })
    controlledArea.onInput({ detail: { value: 'changed' } })
    expect(controlledArea.data.current).toBe('note')
    expect(controlledArea.events.at(-1)?.detail?.detail?.value).toBe('changed')
    controlledArea.setProperty('value', 'changed')
    expect(controlledArea.data.current).toBe('changed')

    const disabled = hostFor(input, { value: 'apple', disabled: true })
    disabled.onInput({ detail: { value: 'pear' } })
    expect(disabled.data.current).toBe('apple')
    expect(disabled.events).toEqual([])

    const readOnly = hostFor(area, { defaultValue: 'note', readOnly: true })
    readOnly.onInput({ detail: { value: 'changed' } })
    expect(readOnly.data.current).toBe('note')
    readOnly.onClear()
    expect(readOnly.data.current).toBe('note')
    expect(readOnly.data.returnFocus).toBe(false)
    const clearable = hostFor(area, { defaultValue: 'note' })
    clearable.onClear()
    expect(clearable.data.current).toBe('')
    expect(clearable.data.returnFocus).toBe(true)
    expect(clearable.events.at(-1)?.detail?.detail?.value).toBe('')
    expect(readOnly.events).toEqual([])
    expect(readOnly.properties.disabled).toBe(false)

    const readOnlyInput = hostFor(input, { defaultValue: 'apple', readOnly: true })
    readOnlyInput.onInput({ detail: { value: 'pear' } })
    expect(readOnlyInput.data.current).toBe('apple')
    expect(readOnlyInput.events).toEqual([])
    expect(readOnlyInput.properties.disabled).toBe(false)
  })

  it('cuts typed text to maxlength and leaves an omitted max length alone', async () => {
    const input = await load('input.ts')
    const open = hostFor(input, { defaultValue: 'pineapple' })
    expect(open.properties.maxlength).toBe(-1)
    open.onInput({ detail: { value: 'pineapple' } })
    expect(open.data.current).toBe('pineapple')

    const limited = hostFor(input, { maxlength: 4, describedBy: 'note-hint' })
    expect(limited.data.count).toBe(0)
    expect(limited.data.described).toBe('note-hint input-count')
    limited.onInput({ detail: { value: 'pineapple' } })
    expect(limited.data.current).toBe('pine')
    expect(limited.data.count).toBe(4)
    expect(limited.events.at(-1)?.detail?.detail?.value).toBe('pine')

    const held = hostFor(input, { defaultValue: 'apple' })
    held.setProperty('maxlength', 3)
    expect(held.data.current).toBe('app')
    expect(held.events.at(-1)?.detail?.detail?.value).toBe('app')

    const controlled = hostFor(input, { value: 'apple' })
    controlled.setProperty('maxlength', 3)
    expect(controlled.data.current).toBe('apple')
    expect(controlled.events.at(-1)?.detail?.detail?.value).toBe('app')
  })

  it('masks a password and uses the number keyboard for a number', async () => {
    const input = await load('input.ts')
    const password = hostFor(input, { type: 'password' })
    expect(password.data.masked).toBe(true)
    expect(password.data.nativeType).toBe('text')
    const number = hostFor(input, { type: 'number' })
    expect(number.data.masked).toBe(false)
    expect(number.data.nativeType).toBe('number')
    const email = hostFor(input, { type: 'email' })
    expect(email.data.nativeType).toBe('text')
    email.setProperty('type', 'password')
    expect(email.data.masked).toBe(true)
    expect(password.data.revealStatus).toBe('')
    password.onReveal()
    expect(password.data.revealed).toBe(true)
    expect(password.data.masked).toBe(false)
    expect(password.data.revealStatus).toBe('Visible')
    expect(password.data.returnFocus).toBe(true)
    password.onReveal()
    expect(password.data.revealed).toBe(false)
    expect(password.data.masked).toBe(true)
    expect(password.data.revealStatus).toBe('')
    const locked = hostFor(input, { type: 'password', disabled: true })
    locked.onReveal()
    expect(locked.data.masked).toBe(true)
    expect(locked.data.revealed).toBe(false)
    expect(locked.data.returnFocus).toBe(false)
  })

  it('announces a required field and leaves an omitted field optional', async () => {
    const input = await load('input.ts')
    const area = await load('../textarea/textarea.ts')
    const required = hostFor(input, { required: true })
    expect(required.properties.required).toBe(true)
    const optional = hostFor(input)
    expect(optional.properties.required).toBe(false)
    const requiredArea = hostFor(area, { required: true })
    expect(requiredArea.properties.required).toBe(true)

    const named = hostFor(input, { 'aria-label': 'Email' })
    expect(named.data.ariaLabel).toBe('Email')
    const plain = hostFor(input)
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Name')
    expect(plain.data.ariaLabel).toBe('Name')
    const namedArea = hostFor(area, { 'aria-label': 'Notes' })
    expect(namedArea.data.ariaLabel).toBe('Notes')
  })

  it('cuts textarea text to maxlength and leaves an omitted max length alone', async () => {
    const area = await load('../textarea/textarea.ts')
    const open = hostFor(area, { defaultValue: 'pineapple' })
    expect(open.properties.maxlength).toBe(-1)
    open.onInput({ detail: { value: 'pineapple' } })
    expect(open.data.current).toBe('pineapple')

    const limited = hostFor(area, { maxlength: 4, describedBy: 'note-hint' })
    expect(limited.data.count).toBe(0)
    expect(limited.data.described).toBe('note-hint textarea-count')
    limited.onInput({ detail: { value: 'pineapple' } })
    expect(limited.data.current).toBe('pine')
    expect(limited.data.count).toBe(4)
    expect(limited.events.at(-1)?.detail?.detail?.value).toBe('pine')

    const held = hostFor(area, { defaultValue: 'apple' })
    held.setProperty('maxlength', 3)
    expect(held.data.current).toBe('app')
    expect(held.events.at(-1)?.detail?.detail?.value).toBe('app')
  })
})
