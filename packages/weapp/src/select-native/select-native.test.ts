import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string; displayText?: string; index?: number; optionStatus?: string }
  methods?: Record<string, (event?: { detail?: { value?: string | number } }) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'select-native.ts')).href)
  if (!captured) throw new Error('select native was not registered')
  definitionCache = captured
  return definitionCache
}

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
]

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
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
    handleChange: (event?: { detail?: { value?: string | number } }) => void
    onOptionTap: (event?: { currentTarget?: { dataset?: { value?: string } } }) => void
    onOptionKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { value?: string } } }) => void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp native select', () => {
  it('links an invalid select to its error', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'select-native.wxml'), 'utf8')
    expect(markup).toContain("aria-invalid=\"{{invalid === true || invalid === 'true' ? 'true' : 'false'}}\"")
    expect(markup).toContain('wx:if="{{describedBy}}"')
    expect(markup).toContain('aria-describedby="{{describedBy}}"')
    expect(markup).not.toContain("aria-describedby=\"{{describedBy || ''}}\"")
    expect(markup).toContain('role="checkbox"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('role="checkbox"')
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"\n    aria-checked=")
    expect(markup).toContain('data-slot="select-native"')
    expect(markup).toContain('aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('bindkeydown="onOptionKey"')
  })

  it('follows a later value and ignores changes while disabled', async () => {
    const host = await hostFor({ options, disabled: true, value: 'apple' })
    expect(host.data.selected).toBe('apple')
    expect(host.data.displayText).toBe('Apple')
    expect(host.data.optionStatus).toBe('Option 1 of 2')
    host.handleChange({ detail: { value: 1 } })
    expect(host.data.selected).toBe('apple')
    host.setProperty('value', 'pear')
    expect(host.data.selected).toBe('pear')
    expect(host.data.displayText).toBe('Pear')
    expect(host.data.optionStatus).toBe('Option 2 of 2')
    host.setProperty('value', '')
    expect(host.data.selected).toBe('')
    expect(host.data.displayText).toBe('')
    expect(host.data.optionStatus).toBe('')
  })

  it('selects the default option and stays empty when the value is empty', async () => {
    const preset = await hostFor({ options, defaultValue: 'pear' })
    expect(preset.data.selected).toBe('pear')
    expect(preset.data.displayText).toBe('Pear')
    preset.handleChange({ detail: { value: 0 } })
    expect(preset.data.selected).toBe('apple')

    const held = await hostFor({ options, value: '', defaultValue: 'pear' })
    expect(held.data.selected).toBe('')
    expect(held.data.displayText).toBe('')
    held.handleChange({ detail: { value: 1 } })
    expect(held.data.selected).toBe('')
    expect(held.events.at(-1)?.detail?.detail?.value).toBe('pear')
  })

  it('stores the option value and ignores changes while disabled', async () => {
    const locked = await hostFor({ options, value: 'apple' })
    locked.handleChange({ detail: { value: 1 } })
    expect(locked.data.selected).toBe('apple')
    expect(locked.data.displayText).toBe('Apple')
    expect(locked.events.at(-1)?.detail?.detail?.value).toBe('pear')
    locked.setProperty('value', 'pear')
    expect(locked.data.selected).toBe('pear')
    expect(locked.data.displayText).toBe('Pear')

    const host = await hostFor({ options })
    expect(host.data.selected).toBe('')
    host.handleChange({ detail: { value: 1 } })
    expect(host.data.selected).toBe('pear')
    expect(host.data.displayText).toBe('Pear')
    host.handleChange({ detail: { value: 0 } })
    expect(host.data.selected).toBe('apple')
    expect(host.events.at(-1)?.detail?.detail?.value).toBe('apple')

    const disabled = await hostFor({ options, disabled: true })
    disabled.handleChange({ detail: { value: 1 } })
    expect(disabled.data.selected).toBe('')
    expect(disabled.events).toEqual([])

    const legacy = await hostFor({ options: ['apple', 'pear'], value: 1 })
    expect(legacy.data.selected).toBe('pear')
    expect(legacy.data.displayText).toBe('pear')
  })

  it('toggles several options while multiple and keeps a controlled value until the parent applies it', async () => {
    const host = await hostFor({ options, multiple: true })
    host.onOptionKey({ detail: { key: ' ' }, currentTarget: { dataset: { value: 'apple' } } })
    host.onOptionKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { value: 'pear' } } })
    expect(host.data.selectedValues).toEqual(['apple', 'pear'])
    expect(host.data.displayText).toBe('Apple, Pear')
    expect(host.data.optionStatus).toBe('2 options selected')

    const held = await hostFor({ options, multiple: true, value: ['apple'] })
    expect(held.data.selectedValues).toEqual(['apple'])
    expect(held.data.optionStatus).toBe('Option 1 of 2')
    held.onOptionTap({ currentTarget: { dataset: { value: 'pear' } } })
    expect(held.data.selectedValues).toEqual(['apple'])
    expect(held.events.at(-1)?.detail?.detail?.value).toEqual(['apple', 'pear'])
    held.setProperty('value', ['apple', 'pear'])
    expect(held.data.selectedValues).toEqual(['apple', 'pear'])

    const disabled = await hostFor({ options, multiple: true, disabled: true })
    disabled.onOptionKey({ detail: { key: ' ' }, currentTarget: { dataset: { value: 'apple' } } })
    expect(disabled.data.selectedValues).toEqual([])
    expect(disabled.events).toEqual([])
  })
})
