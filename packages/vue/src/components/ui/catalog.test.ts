import { createApp, defineComponent, h, type Component } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { componentNames, type ComponentName } from '@timui/core'

import { useForm } from './form/use-form'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

const modules = import.meta.glob('./**/*.vue', { eager: true }) as Record<
  string,
  { default?: Component }
>

const FormProbe = defineComponent({
  name: 'FormProbe',
  setup() {
    const fields = [
      {
        name: 'email',
        label: 'Email',
        rules: [{ kind: 'required' as const, message: 'Email is required' }],
      },
    ]
    const form = useForm(fields)
    const result = form.submit()
    return () => h('form', { 'data-slot': 'form' }, result.snapshot.errors.email ?? '')
  },
})

const propsFor = (name: ComponentName): Record<string, unknown> => {
  if (name === 'checkbox-tree') {
    return {
      tree: { id: 'root', label: 'Root', children: [{ id: 'leaf', label: 'Leaf' }] },
      renderNode: (node: { node: { label: string }; children?: unknown }) =>
        h('div', null, [String(node.node.label), ...(Array.isArray(node.children) ? node.children : [])]),
    }
  }
  if (name === 'image-cropper') {
    return {
      image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    }
  }
  return { id: name }
}

const componentFor = (name: ComponentName): Component => {
  if (name === 'form') return FormProbe
  const key = `./${name}/${name}.vue`
  const component = modules[key]?.default
  if (!component) throw new Error(`missing vue component ${key}`)
  return component
}

const mounted: Array<{ unmount: () => void; el: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) item.unmount()
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue components', () => {
  it.each(componentNames)('%s mounts and renders', async (name) => {
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp({
      render: () => h(componentFor(name), propsFor(name), () => 'Example'),
    })
    app.mount(el)
    mounted.push({ unmount: () => app.unmount(), el })
    expect(el.innerHTML.length, name).toBeGreaterThan(0)
    if (name === 'button') {
      const button = el.querySelector('[data-slot="button"]') as HTMLElement | null
      expect(button, el.innerHTML).toBeTruthy()
      expect(button?.textContent).toContain('Example')
      button?.click()
    }
    if (name === 'form') expect(el.textContent).toContain('Email is required')
    if (name === 'checkbox-tree') expect(el.textContent).toContain('Leaf')
  })
})
