import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Sheet from './sheet.vue'
import SheetContent from './sheet-content.vue'
import SheetDescription from './sheet-description.vue'
import SheetTitle from './sheet-title.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (side: 'left' | 'top', contentSide?: 'top') => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Sheet, { side, defaultOpen: true }, () =>
        h(SheetContent, contentSide ? { side: contentSide } : {}, () => [
          h(SheetTitle, () => 'Panel'),
          h(SheetDescription, () => 'More about this sheet.'),
        ])
      ),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const contentClass = () => document.querySelector('[data-slot="sheet-content"]')?.className ?? ''

describe('vue sheet side', () => {
  it('docks the content on the side set by the sheet root', async () => {
    await show('left')
    expect(contentClass()).toContain('left-0')
    expect(contentClass()).not.toContain('right-0')
  })

  it('lets the content side override the root', async () => {
    await show('left', 'top')
    expect(contentClass()).toContain('top-0')
    expect(contentClass()).not.toContain('left-0')
  })

  it('names the sheet from its title', async () => {
    await show('left')
    const content = document.querySelector('[data-slot="sheet-content"]')
    const title = document.querySelector('[data-slot="sheet-title"]')
    expect(title?.textContent).toContain('Panel')
    const description = document.querySelector('[data-slot="sheet-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
  })

  it('names an omitted sheet Sheet', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Sheet, { defaultOpen: true }, () => [h(SheetContent)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="sheet-content"]')?.getAttribute('aria-label')).toBe('Sheet')
  })
})
