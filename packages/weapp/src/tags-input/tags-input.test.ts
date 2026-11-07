import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { tags?: string[]; tagStatus?: string; inputValue?: string }
  methods?: Record<string, (event?: unknown) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'tags-input.ts')).href)
  if (!captured) throw new Error('tags input was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail: unknown }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail: unknown) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    events,
    detached: () => definition.lifetimes?.detached?.call(host),
  }) as typeof host & {
    events: Array<{ name: string; detail: unknown }>
    onConfirm: (event: { detail: { value: string } }) => void
    onDeleteKey: (event: { detail?: { key?: string }; currentTarget: { dataset: { index?: number } } }) => void
    onInputKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp tags input', () => {
  it('names the tag field and each remove button', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'tags-input.wxml'), 'utf8')
    expect(markup).toContain('role="group"')
    expect(markup).toContain('wx:if="{{ariaLabel && labelledBy}}"')
    expect(markup).toContain('wx:elif="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{placeholder || 'Add a tag'}}\"")
    expect(markup).not.toContain("aria-label=\"{{ariaLabel ? ariaLabel : (labelledBy ? '' : (placeholder || 'Add a tag'))}}\"")
    expect(markup).toContain('role="list"')
    const first = markup.split('wx:elif')[0]
    expect(first.lastIndexOf('role="listitem"')).toBeLessThan(first.indexOf('class="tags-input"'))
    expect(markup).toContain('aria-label="Remove tag"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    expect(markup).toContain("tabindex=\"{{disabled || readOnly ? -1 : 0}}\"")
    expect(markup).toContain('role="button"')
    expect(markup).toContain('bindkeydown="onDeleteKey"')
    expect(markup).toContain('bindkeydown="onInputKey"')
    expect(markup.match(/aria-readonly="\{\{readOnly \? 'true' : 'false'\}\}"/g)).toHaveLength(4)
    expect(markup.match(/aria-disabled="\{\{disabled \|\| readOnly \? 'true' : 'false'\}\}"/g)).toHaveLength(4)
    const named = await hostFor({ 'aria-label': 'Topics', 'aria-labelledby': 'tag-title' })
    expect(named.data.ariaLabel).toBe('Topics')
    expect(named.data.labelledBy).toBe('tag-title')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
    named.detached()
    plain.detached()
  })

  it('follows a later value and ignores confirm while disabled', async () => {
    const host = await hostFor({ value: ['apple'] })
    expect(host.data.tags).toEqual(['apple'])
    expect(host.data.tagStatus).toBe('1 tag')
    host.setData({ value: ['apple', 'pear'] })
    expect(host.data.tagStatus).toBe('2 tags')
    host.setData({ value: ['pear'] })
    expect(host.data.tags).toEqual(['pear'])
    expect(host.data.tagStatus).toBe('1 tag')
    host.setProperty('value', [])
    expect(host.data.tags).toEqual([])
    expect(host.data.tagStatus).toBe('')
    host.onConfirm({ detail: { value: 'plum' } })
    expect(host.data.tags).toEqual([])
    expect(host.events.at(-1)?.detail).toMatchObject({ detail: { value: ['plum'] } })
    host.setProperty('value', ['plum'])
    expect(host.data.tags).toEqual(['plum'])
    host.detached()

    const disabled = await hostFor({ disabled: true, value: ['apple'] })
    expect(disabled.data.tags).toEqual(['apple'])
    disabled.setData({ value: ['pear'] })
    expect(disabled.data.tags).toEqual(['pear'])
    disabled.onConfirm({ detail: { value: 'plum' } })
    expect(disabled.data.tags).toEqual(['pear'])
    disabled.detached()
  })

  it('shows the default tags and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['apple'] })
    expect(preset.data.tags).toEqual(['apple'])
    preset.detached()

    const held = await hostFor({ value: [], defaultValue: ['apple'] })
    expect(held.data.tags).toEqual([])
    held.onConfirm({ detail: { value: 'pear' } })
    expect(held.data.tags).toEqual([])
    expect(held.events.at(-1)?.detail).toMatchObject({ detail: { value: ['pear'] } })
    held.detached()
  })

  it('adds a tag on confirm and ignores disabled or read-only input', async () => {
    const host = await hostFor()
    host.onConfirm({ detail: { value: ' pear ' } })
    expect(host.data.tags).toEqual(['pear'])
    expect(host.data.inputValue).toBe('')
    host.onInput({ detail: { value: 'a' } })
    host.onInputKey({ detail: { key: 'Backspace' } })
    expect(host.data.tags).toEqual(['pear'])
    expect(host.data.highlightedIndex).toBe(-1)
    host.onInput({ detail: { value: '' } })
    host.onInputKey({ detail: { key: 'Backspace' } })
    expect(host.data.tags).toEqual(['pear'])
    expect(host.data.highlightedIndex).toBe(0)
    host.onInputKey({ detail: { key: 'Backspace' } })
    expect(host.data.tags).toEqual([])
    expect(host.data.highlightedIndex).toBe(-1)
    host.onConfirm({ detail: { value: 'pear' } })
    host.onDeleteKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.tags).toEqual([])
    expect(host.events.length).toBeGreaterThan(0)

    const locked = await hostFor({ disabled: true })
    locked.onConfirm({ detail: { value: 'apple' } })
    expect(locked.data.tags).toEqual([])

    const frozen = await hostFor({ readOnly: true, value: ['apple'] })
    frozen.onConfirm({ detail: { value: 'pear' } })
    frozen.onInputKey({ detail: { key: 'Backspace' } })
    expect(frozen.data.tags).toEqual(['apple'])
    host.detached()
    locked.detached()
    frozen.detached()
  })
})
