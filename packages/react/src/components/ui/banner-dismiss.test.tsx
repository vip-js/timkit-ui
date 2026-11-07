// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Banner, BannerIcon } from './banner'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(node))
  mounted.push({ root, host })
  return host
}

describe('banner dismiss', () => {
  it('dismisses when allowed and stays when it is not dismissible', () => {
    const closed: string[] = []
    const enabled = show(
      <Banner
        dismissible
        onClose={() => {
          closed.push('close')
        }}
      >
        Saved
      </Banner>
    )
    expect(enabled.querySelector('[data-slot="banner"]')).toBeTruthy()
    act(() => {
      ;(enabled.querySelector('[data-slot="banner-close"]') as HTMLButtonElement).click()
    })
    expect(enabled.querySelector('[data-slot="banner"]')).toBeNull()
    expect(closed).toEqual(['close'])

    const fixed = show(<Banner>Saved</Banner>)
    expect(fixed.querySelector('[data-slot="banner-close"]')).toBeNull()
    expect(fixed.querySelector('[data-slot="banner"]')).toBeTruthy()
  })

  it('stays open until the controlled value changes and starts closed from defaultOpen', () => {
    const seen: boolean[] = []
    function Held() {
      const [open, setOpen] = useState(true)
      return (
        <Banner
          dismissible
          open={open}
          defaultOpen={false}
          onOpenChange={(next) => {
            seen.push(next)
            if (seen.length > 1) setOpen(next)
          }}
        >
          Saved
        </Banner>
      )
    }
    const held = show(<Held />)
    expect(held.querySelector('[data-slot="banner"]')).toBeTruthy()
    act(() => {
      ;(held.querySelector('[data-slot="banner-close"]') as HTMLButtonElement).click()
    })
    expect(held.querySelector('[data-slot="banner"]')).toBeTruthy()
    expect(seen).toEqual([false])
    act(() => {
      ;(held.querySelector('[data-slot="banner-close"]') as HTMLButtonElement).click()
    })
    expect(held.querySelector('[data-slot="banner"]')).toBeNull()

    const preset = show(
      <Banner dismissible defaultOpen={false}>
        Saved
      </Banner>
    )
    expect(preset.querySelector('[data-slot="banner"]')).toBeNull()
  })

  it('hides the icon from the banner name', () => {
    show(
      <Banner>
        <BannerIcon>!</BannerIcon>
        Saved
      </Banner>
    )
    expect(document.querySelector('[data-slot="banner-icon"]')?.getAttribute('aria-hidden')).toBe('true')
  })
})
