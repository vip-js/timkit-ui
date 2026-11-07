import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { checked?: boolean; checkStatus?: string }
  methods?: Record<string, (event?: { detail?: { value?: boolean } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'switch.ts')).href)
  if (!captured) throw new Error('switch component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail: { detail?: { checked?: boolean } } }>,
    triggerEvent(name: string, detail: { detail?: { checked?: boolean } }) {
      host.events.push({ name, detail })
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    onSwitchChange: (event?: { detail?: { value?: boolean } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail: { detail?: { checked?: boolean } } }>
  }
}

describe('weapp switch', () => {
  it('links an invalid switch to its error', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'switch.wxml'), 'utf8')
    expect(markup).toContain("aria-invalid=\"{{invalid === true || invalid === 'true' ? 'true' : 'false'}}\"")
    expect(markup).toContain('wx:if="{{describedBy}}"')
    expect(markup).toContain('aria-describedby="{{describedBy}}"')
    expect(markup).not.toContain("aria-describedby=\"{{describedBy || ''}}\"")
    expect(markup.indexOf('bindkeydown="onKey"')).toBeGreaterThan(markup.indexOf('<switch'))
    expect(markup).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(markup.split('<switch')[1]).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Switch'}}\"")
    expect(markup).toContain('role="status"')
  })

  it('follows a later checked value and ignores a disabled change', async () => {
    const host = await hostFor({ checked: false })
    expect(host.data.checked).toBe(false)
    host.onSwitchChange({ detail: { value: true } })
    expect(host.data.checked).toBe(false)
    expect(host.events.at(-1)?.detail.detail?.checked).toBe(true)
    host.setProperty('checked', true)
    expect(host.data.checked).toBe(true)

    const disabled = await hostFor({ disabled: true, checked: false })
    disabled.onSwitchChange({ detail: { value: true } })
    expect(disabled.data.checked).toBe(false)
    disabled.setProperty('checked', true)
    expect(disabled.data.checked).toBe(true)
  })

  it('starts on from the default and stays off when checked is false', async () => {
    const preset = await hostFor({ defaultChecked: true })
    expect(preset.data.checked).toBe(true)
    expect(preset.data.checkStatus).toBe('On')
    preset.onSwitchChange({ detail: { value: false } })
    expect(preset.data.checked).toBe(false)
    expect(preset.data.checkStatus).toBe('')

    const held = await hostFor({ checked: false, defaultChecked: true })
    expect(held.data.checked).toBe(false)
    held.onSwitchChange({ detail: { value: true } })
    expect(held.data.checked).toBe(false)
    expect(held.events.at(-1)?.detail.detail?.checked).toBe(true)
  })

  it('toggles with the shared Space key and ignores it while disabled', async () => {
    const host = await hostFor()
    expect(host.data.checkStatus).toBe('')
    host.onKey({ detail: { key: ' ' } })
    expect(host.data.checked).toBe(true)
    expect(host.data.checkStatus).toBe('On')

    const held = await hostFor({ checked: false })
    held.onKey({ detail: { key: ' ' } })
    expect(held.data.checked).toBe(false)
    expect(held.events.at(-1)?.detail.detail?.checked).toBe(true)

    const disabled = await hostFor({ disabled: true })
    disabled.onKey({ detail: { key: ' ' } })
    expect(disabled.data.checked).toBe(false)
    expect(disabled.events).toEqual([])
  })

  it('selects when enabled and ignores the change while disabled', async () => {
    const enabled = await hostFor()
    enabled.onSwitchChange({ detail: { value: true } })
    expect(enabled.data.checked).toBe(true)

    const disabled = await hostFor({ disabled: true, checked: true })
    disabled.onSwitchChange({ detail: { value: false } })
    expect(disabled.data.checked).toBe(true)
  })

  it('ignores changes and keys while read-only and still follows a later checked value', async () => {
    const frozen = await hostFor({ readOnly: true, checked: false })
    frozen.onSwitchChange({ detail: { value: true } })
    frozen.onKey({ detail: { key: ' ' } })
    expect(frozen.data.checked).toBe(false)
    expect(frozen.events).toEqual([])
    frozen.setProperty('checked', true)
    expect(frozen.data.checked).toBe(true)
  })

  it('uses a passed accessible name and leaves an omitted name empty', async () => {
    const named = await hostFor({ 'aria-label': 'Wi-Fi' })
    expect(named.data.ariaLabel).toBe('Wi-Fi')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Bluetooth')
    expect(plain.data.ariaLabel).toBe('Bluetooth')
  })
})
