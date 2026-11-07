// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Progress } from './progress'

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

describe('progress value', () => {
  it('names an omitted progress bar Progress and keeps a passed name', () => {
    show(
      <>
        <Progress value={40} />
        <Progress value={40} aria-label="Upload" />
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="progress"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Progress', 'Upload'])
  })

  it('shows the shared percent and an indeterminate state when the value is empty', () => {
    const host = show(<Progress value={40} />)
    const bar = host.querySelector('[data-slot="progress"]')
    const indicator = host.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(bar?.getAttribute('aria-valuenow')).toBe('40')
    expect(bar?.getAttribute('aria-valuetext')).toBe('40%')
    expect(host.querySelector('[data-slot="progress-value"]')?.textContent).toBe('40%')
    expect(bar?.getAttribute('data-state')).toBe('loading')
    expect(indicator.style.transform).toBe('translateX(-60%)')

    const empty = show(<Progress value={null} />)
    expect(empty.querySelector('[data-slot="progress"]')?.getAttribute('data-state')).toBe('indeterminate')
    expect(empty.querySelector('[data-slot="progress"]')?.getAttribute('aria-valuetext')).toBeNull()
    expect(empty.querySelector('[data-slot="progress-value"]')).toBeNull()
    const half = show(<Progress value={50} max={200} />)
    expect(half.querySelector('[data-slot="progress-value"]')?.textContent).toBe('25%')

    const capped = show(<Progress value={150} max={100} />)
    expect((capped.querySelector('[data-slot="progress-indicator"]') as HTMLElement).style.transform).toBe(
      'translateX(-0%)'
    )
  })
})
