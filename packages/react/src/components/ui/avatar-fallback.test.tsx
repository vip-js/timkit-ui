// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

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
}

const image = () => document.querySelector('[data-slot="avatar-image"]') as HTMLImageElement
const fallback = () => document.querySelector('[data-slot="avatar-fallback"]') as HTMLElement

const emit = async (node: HTMLElement, name: 'onLoad' | 'onError') => {
  const key = Object.keys(node).find((item) => item.startsWith('__reactProps'))
  const handler = key ? (node as unknown as Record<string, Record<string, (event: Event) => void>>)[key]?.[name] : undefined
  if (!handler) throw new Error(`missing ${name}`)
  await act(async () => {
    handler(new Event(name === 'onLoad' ? 'load' : 'error'))
    await Promise.resolve()
  })
}

describe('avatar fallback', () => {
  it('shows the fallback when the image fails and the image when it loads', async () => {
    show(
      <Avatar>
        <AvatarImage src="https://example.com/ada.png" alt="Ada" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    )
    expect(fallback().textContent).toBe('A')
    expect(image().getAttribute('alt')).toBe('Ada')
    show(
      <Avatar>
        <AvatarImage src="https://example.com/ada.png" />
      </Avatar>
    )
    expect(document.querySelectorAll('[data-slot="avatar-image"]')[1]?.getAttribute('alt')).toBe('Avatar')
    expect(image().getAttribute('data-state')).toBe('hidden')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await emit(image(), 'onError')
    expect(image().getAttribute('data-state')).toBe('hidden')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Unavailable')
    expect(fallback().hidden).toBe(false)
    await emit(image(), 'onLoad')
    expect(image().getAttribute('data-state')).toBe('visible')
    expect(fallback().hidden).toBe(true)
    expect(document.querySelector('[role="status"]')).toBeNull()
  })
})
