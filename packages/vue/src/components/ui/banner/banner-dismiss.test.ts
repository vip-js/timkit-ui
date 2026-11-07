import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Banner from './banner.vue'
import BannerIcon from './banner-icon.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () => h(Banner, props, () => 'Saved'),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return host
}

describe('vue banner dismiss', () => {
  it('dismisses when allowed and stays when it is not dismissible', async () => {
    const closed: string[] = []
    const enabled = show({ dismissible: true, onClose: () => closed.push('close') })
    await nextTick()
    expect(enabled.querySelector('[data-slot="banner"]')).toBeTruthy()
    ;(enabled.querySelector('[data-slot="banner-close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(enabled.querySelector('[data-slot="banner"]')).toBeNull()
    expect(closed).toEqual(['close'])

    const fixed = show()
    await nextTick()
    expect(fixed.querySelector('[data-slot="banner-close"]')).toBeNull()
    expect(fixed.querySelector('[data-slot="banner"]')).toBeTruthy()
  })

  it('stays open until the controlled value changes and starts closed from defaultOpen', async () => {
    const seen: boolean[] = []
    const open = ref<boolean | null>(true)
    const Held = defineComponent({
      setup() {
        return () =>
          h(
            Banner,
            {
              dismissible: true,
              open: open.value,
              defaultOpen: false,
              onOpenChange: (next: boolean) => {
                seen.push(next)
              },
            },
            () => 'Saved'
          )
      },
    })
    const held = document.createElement('div')
    document.body.append(held)
    const app = createApp(Held)
    app.mount(held)
    mounted.push({ unmount: () => app.unmount(), host: held })
    await nextTick()
    expect(held.querySelector('[data-slot="banner"]')).toBeTruthy()
    ;(held.querySelector('[data-slot="banner-close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(held.querySelector('[data-slot="banner"]')).toBeTruthy()
    expect(seen).toEqual([false])
    open.value = false
    await nextTick()
    expect(held.querySelector('[data-slot="banner"]')).toBeNull()
    open.value = null
    await nextTick()
    expect(held.querySelector('[data-slot="banner"]')).toBeNull()

    const preset = show({ dismissible: true, defaultOpen: false })
    await nextTick()
    expect(preset.querySelector('[data-slot="banner"]')).toBeNull()
  })

  it('hides the icon from the banner name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Banner, () => [h(BannerIcon, () => '!'), 'Saved']),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="banner-icon"]')?.getAttribute('aria-hidden')).toBe('true')
  })
})
