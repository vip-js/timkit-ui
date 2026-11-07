import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Avatar from './avatar.vue'
import AvatarFallback from './avatar-fallback.vue'
import AvatarImage from './avatar-image.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue avatar fallback', () => {
  it('shows the fallback when the image fails and the image when it loads', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Avatar, () => [
          h(AvatarImage, { src: 'https://example.com/ada.png', alt: 'Ada' }),
          h(AvatarFallback, () => 'A'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const image = () => document.querySelector('[data-slot="avatar-image"]') as HTMLImageElement
    const fallback = () => document.querySelector('[data-slot="avatar-fallback"]') as HTMLElement
    expect(fallback().textContent).toContain('A')
    expect(image().getAttribute('alt')).toBe('Ada')
    const plain = document.createElement('div')
    document.body.append(plain)
    const plainApp = createApp({
      render: () => h(Avatar, () => [h(AvatarImage, { src: 'https://example.com/ada.png' })]),
    })
    plainApp.mount(plain)
    mounted.push({ unmount: () => plainApp.unmount(), host: plain })
    await nextTick()
    expect(plain.querySelector('[data-slot="avatar-image"]')?.getAttribute('alt')).toBe('Avatar')
    expect(image().getAttribute('data-state')).toBe('hidden')
    expect(document.querySelector('[role="status"]')).toBeNull()
    image().dispatchEvent(new Event('error'))
    await nextTick()
    expect(image().getAttribute('data-state')).toBe('hidden')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Unavailable')
    expect(fallback().hidden).toBe(false)
    image().dispatchEvent(new Event('load'))
    await nextTick()
    expect(image().getAttribute('data-state')).toBe('visible')
    expect(fallback().hidden).toBe(true)
    expect(document.querySelector('[role="status"]')).toBeNull()
  })
})
