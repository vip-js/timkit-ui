import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Alert from './alert.vue'
import AlertDescription from './alert-description.vue'
import AlertTitle from './alert-title.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue alert variant', () => {
  it('announces a default alert and a destructive alert', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Alert, () => 'Saved'), h(Alert, { variant: 'destructive' }, () => 'Failed')]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const alert = (index: number) => document.querySelectorAll('[data-slot="alert"]')[index] as HTMLElement
    expect(alert(0).getAttribute('role')).toBe('alert')
    expect(alert(0).getAttribute('data-variant')).toBe('default')
    expect(alert(1).getAttribute('role')).toBe('alert')
    expect(alert(0).querySelector('[role="status"]')).toBeNull()
    expect(alert(1).getAttribute('data-variant')).toBe('destructive')
    expect(alert(1).querySelector('[role="status"]')?.textContent).toBe('Destructive')
    expect(alert(1).className).toContain('text-destructive')
  })

  it('keeps the title and description inside the alert', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Alert, () => [h(AlertTitle, () => 'Saved'), h(AlertDescription, () => 'The file was stored.')]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const alert = host.querySelector('[role="alert"]')
    const title = alert?.querySelector('[data-slot="alert-title"]')
    const description = alert?.querySelector('[data-slot="alert-description"]')
    expect(title?.tagName).toBe('H5')
    expect(title?.textContent).toBe('Saved')
    expect(description?.textContent).toBe('The file was stored.')
  })
})
