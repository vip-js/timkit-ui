import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createForm, submitForm } from '@timui/core'

type PropertySpec = { value?: unknown }
type ComponentDefinition = {
  properties?: Record<string, PropertySpec>
  data?: Record<string, unknown>
  methods?: Record<string, (...args: unknown[]) => unknown>
  lifetimes?: {
    attached?: () => void
    detached?: () => void
  }
}

const root = path.resolve(__dirname)

const files = fs
  .readdirSync(root, { recursive: true })
  .map((entry) => String(entry))
  .filter(
    (entry) =>
      entry.endsWith('.ts') &&
      !entry.split(path.sep).includes('utils') &&
      !entry.endsWith('.test.ts') &&
      !entry.endsWith('manifest.ts') &&
      !entry.endsWith('utils.ts') &&
      !entry.endsWith(`${path.sep}days.ts`)
  )
  .sort()

const hostFor = (definition: ComponentDefinition) => {
  const properties: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) {
    properties[key] = spec?.value
  }
  const data = { ...(definition.data ?? {}) }
  const host: Record<string, unknown> = {
    properties,
    data,
    setData(update: Record<string, unknown> | ((current: Record<string, unknown>) => Record<string, unknown>)) {
      const next = typeof update === 'function' ? update(data) : update
      Object.assign(data, next)
    },
    triggerEvent() {},
    selectComponent() {
      return null
    },
  }
  Object.assign(host, definition.methods ?? {})
  return host
}

const load = async (relativePath: string) => {
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  const href = pathToFileURL(path.join(root, relativePath)).href
  const mod = (await import(href)) as Record<string, unknown>
  return { captured, mod }
}

describe('weapp components', () => {
  it('loads every component source', () => {
    expect(files.length).toBeGreaterThan(120)
  })

  it.each(files)('%s runs its component or machine', async (relativePath) => {
    if (relativePath.endsWith(`${path.sep}form${path.sep}form.ts`) || relativePath.endsWith('form/form.ts')) {
      const fields = [
        {
          name: 'email',
          label: 'Email',
          rules: [{ kind: 'required' as const, message: 'Email is required' }],
        },
      ]
      const result = submitForm(createForm(fields), fields)
      expect(result.ok).toBe(false)
      expect(result.snapshot.errors.email).toBe('Email is required')
      return
    }

    const { captured, mod } = await load(relativePath)
    if (captured) {
      const host = hostFor(captured)
      captured.lifetimes?.attached?.call(host)
      expect(captured.properties || captured.methods || captured.lifetimes).toBeTruthy()
      captured.lifetimes?.detached?.call(host)
      return
    }

    const setup = Object.entries(mod).find(
      ([name, value]) => name.startsWith('setup') && typeof value === 'function'
    )
    expect(setup, relativePath).toBeTruthy()
    const instance = hostFor({ properties: { id: { value: 'widget' }, open: { value: false } }, data: { api: {} } })
    const fn = setup?.[1] as (instance: object, context?: object) => unknown
    expect(fn(instance, { collection: [] })).toBeTruthy()
  })
})
