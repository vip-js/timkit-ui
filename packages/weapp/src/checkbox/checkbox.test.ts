import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { stateName?: string; checkStatus?: string }
  methods?: Record<string, () => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void; detached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'checkbox.ts')).href)
  if (!captured) throw new Error('checkbox was not registered')
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
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail: { detail?: { checked?: boolean } } }>
  }
}

describe('weapp checkbox', () => {
  it('exposes a checkbox that can be mixed', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'checkbox.wxml'), 'utf8')
    expect(markup).toContain('role="checkbox"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain("tabindex=\"{{api.disabled ? -1 : 0}}\"")
    expect(markup).toContain("aria-checked=\"{{stateName === 'indeterminate' ? 'mixed' : stateName === 'checked' ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{api.disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-label="{{ariaLabel}}"')
    expect(markup.match(/aria-hidden="true"/g)).toHaveLength(4)
    expect(markup).toContain('wx:if="{{describedBy}}"')
    expect(markup).toContain('aria-describedby="{{describedBy}}"')
    expect(markup).not.toContain("aria-describedby=\"{{describedBy || ''}}\"")
  })

  it('checks, clears, and stays clear while disabled', async () => {
    const enabled = await hostFor()
    expect(enabled.data.stateName).toBe('unchecked')
    expect(enabled.data.checkStatus).toBe('')
    enabled.onTap()
    expect(enabled.data.stateName).toBe('checked')
    expect(enabled.data.checkStatus).toBe('Checked')
    enabled.onTap()
    expect(enabled.data.stateName).toBe('unchecked')
    expect(enabled.data.checkStatus).toBe('')

    const controlled = await hostFor({ checked: false })
    controlled.onTap()
    expect(controlled.data.stateName).toBe('unchecked')
    expect(controlled.events.at(-1)?.detail.detail?.checked).toBe(true)
    controlled.setProperty('checked', true)
    expect(controlled.data.stateName).toBe('checked')
    controlled.detached?.()

    const disabled = await hostFor({ disabled: true })
    disabled.onTap()
    expect(disabled.data.stateName).toBe('unchecked')

    const preset = await hostFor({ defaultChecked: true })
    expect(preset.data.stateName).toBe('checked')
    preset.onTap()
    expect(preset.data.stateName).toBe('unchecked')

    const spaced = await hostFor()
    spaced.onKey({ detail: { key: ' ' } })
    expect(spaced.data.stateName).toBe('checked')
    const heldKey = await hostFor({ checked: false })
    heldKey.onKey({ detail: { key: ' ' } })
    expect(heldKey.data.stateName).toBe('unchecked')
    expect(heldKey.events.at(-1)?.detail.detail?.checked).toBe(true)
    const locked = await hostFor({ disabled: true })
    locked.onKey({ detail: { key: ' ' } })
    expect(locked.data.stateName).toBe('unchecked')
    expect(locked.events).toEqual([])

    const held = await hostFor({ checked: false, defaultChecked: true })
    expect(held.data.stateName).toBe('unchecked')
    held.onTap()
    expect(held.data.stateName).toBe('unchecked')
    expect(held.events.at(-1)?.detail.detail?.checked).toBe(true)
  })

  it('ignores taps and keys while read-only and still follows a later checked value', async () => {
    const frozen = await hostFor({ readOnly: true, checked: false })
    frozen.onTap()
    frozen.onKey({ detail: { key: ' ' } })
    expect(frozen.data.stateName).toBe('unchecked')
    expect(frozen.events).toEqual([])
    frozen.setProperty('checked', true)
    expect(frozen.data.stateName).toBe('checked')
  })

  it('announces indeterminate as mixed and follows a later mixed value', async () => {
    const host = await hostFor({ checked: 'indeterminate' })
    expect(host.data.stateName).toBe('indeterminate')
    expect(host.data.checkStatus).toBe('Mixed')
    const clear = await hostFor({ checked: false })
    expect(clear.data.stateName).toBe('unchecked')
    clear.setProperty('checked', 'indeterminate')
    expect(clear.data.stateName).toBe('indeterminate')
  })

  it('uses a passed accessible name and leaves an omitted name empty', async () => {
    const named = await hostFor({ 'aria-label': 'Accept terms' })
    expect(named.data.ariaLabel).toBe('Accept terms')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Subscribe')
    expect(plain.data.ariaLabel).toBe('Subscribe')
  })
})
