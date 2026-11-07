import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Progress from './progress.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown>) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: () => h(Progress, props) })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return host
}

describe('vue progress value', () => {
  it('names an omitted progress bar Progress and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Progress, { modelValue: 40 }), h(Progress, { modelValue: 40, 'aria-label': 'Upload' })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('[data-slot="progress"]')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['Progress', 'Upload'])
  })

  it('shows the shared percent and an indeterminate state when the value is empty', async () => {
    const host = show({ modelValue: 40 })
    await nextTick()
    const bar = host.querySelector('[data-slot="progress"]')
    const indicator = host.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(bar?.getAttribute('aria-valuenow')).toBe('40')
    expect(bar?.getAttribute('aria-valuetext')).toBe('40%')
    expect(host.querySelector('[data-slot="progress-value"]')?.textContent).toBe('40%')
    expect(bar?.getAttribute('data-state')).toBe('loading')
    expect(indicator.style.transform).toBe('translateX(-60%)')

    const empty = show({ modelValue: null })
    await nextTick()
    expect(empty.querySelector('[data-slot="progress"]')?.getAttribute('data-state')).toBe('indeterminate')
    expect(empty.querySelector('[data-slot="progress"]')?.getAttribute('aria-valuetext')).toBeNull()
    expect(empty.querySelector('[data-slot="progress-value"]')).toBeNull()
    const half = show({ modelValue: 50, max: 200 })
    await nextTick()
    expect(half.querySelector('[data-slot="progress-value"]')?.textContent).toBe('25%')

    const capped = show({ modelValue: 150, max: 100 })
    await nextTick()
    expect((capped.querySelector('[data-slot="progress-indicator"]') as HTMLElement).style.transform).toBe(
      'translateX(-0%)'
    )
  })
})
