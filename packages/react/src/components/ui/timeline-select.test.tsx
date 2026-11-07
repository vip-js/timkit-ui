// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Timeline, TimelineItem } from './timeline'

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

const item = (step: number) =>
  document.querySelector(`[data-slot="timeline-item"][data-state]`) &&
  (Array.from(document.querySelectorAll('[data-slot="timeline-item"]'))[step - 1] as HTMLElement)

describe('timeline select', () => {
  it('selects a step and ignores a disabled step', () => {
    const seen: number[] = []
    show(
      <Timeline defaultValue={1} onValueChange={(value) => seen.push(value)}>
        <TimelineItem step={1}>One</TimelineItem>
        <TimelineItem step={2}>Two</TimelineItem>
        <TimelineItem step={3} disabled>
          Three
        </TimelineItem>
      </Timeline>
    )
    expect(item(1)?.getAttribute('data-state')).toBe('active')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Step 1 of 3')
    act(() => {
      item(2)?.click()
    })
    expect(item(2)?.getAttribute('data-state')).toBe('active')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Step 2 of 3')
    expect(item(1)?.getAttribute('data-state')).toBe('completed')
    expect(seen).toEqual([2])
    act(() => {
      item(3)?.click()
    })
    expect(item(2)?.getAttribute('data-state')).toBe('active')
    expect(item(3)?.getAttribute('aria-disabled')).toBe('true')
    expect(item(2)?.getAttribute('role')).toBe('button')
    expect(seen).toEqual([2])
    act(() => {
      item(1)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })
    expect(item(1)?.getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([2, 1])
    act(() => {
      item(3)?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    })
    expect(item(1)?.getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([2, 1])
  })

  it('stays inactive when value is null even if the default is the first step', () => {
    const seen: number[] = []
    show(
      <Timeline value={null as unknown as number} defaultValue={1} onValueChange={(value) => seen.push(value)}>
        <TimelineItem step={1}>One</TimelineItem>
        <TimelineItem step={2}>Two</TimelineItem>
      </Timeline>
    )
    expect(item(1)?.getAttribute('data-state')).toBe('inactive')
    expect(document.querySelector('[role="status"]')).toBeNull()
    act(() => {
      item(2)?.click()
    })
    expect(item(1)?.getAttribute('data-state')).toBe('inactive')
    expect(item(2)?.getAttribute('data-state')).toBe('inactive')
    expect(seen).toEqual([2])
  })

  it('ignores step changes while the timeline is disabled', () => {
    const seen: number[] = []
    show(
      <Timeline defaultValue={1} disabled onValueChange={(value) => seen.push(value)}>
        <TimelineItem step={1}>One</TimelineItem>
        <TimelineItem step={2}>Two</TimelineItem>
      </Timeline>
    )
    expect(document.querySelector('[data-slot="timeline"]')?.getAttribute('aria-disabled')).toBe('true')
    act(() => {
      item(2)?.click()
    })
    expect(item(1)?.getAttribute('data-state')).toBe('active')
    expect(item(2)?.getAttribute('aria-disabled')).toBe('true')
    expect(seen).toEqual([])
  })

  it('is vertical unless orientation is horizontal', () => {
    show(
      <Timeline>
        <TimelineItem step={1}>One</TimelineItem>
      </Timeline>
    )
    expect(document.querySelector('[data-slot="timeline"]')?.getAttribute('data-orientation')).toBe('vertical')
    document.body.innerHTML = ''
    show(
      <Timeline orientation="horizontal">
        <TimelineItem step={1}>One</TimelineItem>
      </Timeline>
    )
    const roots = document.querySelectorAll('[data-slot="timeline"]')
    expect(roots[roots.length - 1]?.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('selects the next enabled step with the axis arrows and Home or End', () => {
    show(
      <>
        <Timeline defaultValue={1}>
          <TimelineItem step={1}>One</TimelineItem>
          <TimelineItem step={2} disabled>
            Two
          </TimelineItem>
          <TimelineItem step={3}>Three</TimelineItem>
        </Timeline>
        <Timeline orientation="horizontal" defaultValue={1}>
          <TimelineItem step={1}>One</TimelineItem>
          <TimelineItem step={2}>Two</TimelineItem>
        </Timeline>
        <Timeline disabled defaultValue={1}>
          <TimelineItem step={1}>One</TimelineItem>
          <TimelineItem step={2}>Two</TimelineItem>
        </Timeline>
      </>
    )
    const roots = () => document.querySelectorAll('[data-slot="timeline"]')
    const active = (index: number) =>
      roots()[index]?.querySelector('[aria-current="step"]')?.getAttribute('data-step')
    const press = (index: number, step: string, key: string) => {
      act(() => {
        roots()
          [index]?.querySelector(`[data-step="${step}"]`)
          ?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    press(0, '1', 'ArrowDown')
    expect(active(0)).toBe('3')
    press(0, '3', 'ArrowDown')
    expect(active(0)).toBe('3')
    press(0, '3', 'ArrowRight')
    expect(active(0)).toBe('3')
    press(0, '3', 'Home')
    expect(active(0)).toBe('1')
    press(0, '1', 'End')
    expect(active(0)).toBe('3')
    press(1, '1', 'ArrowRight')
    expect(active(1)).toBe('2')
    press(1, '2', 'ArrowDown')
    expect(active(1)).toBe('2')
    press(2, '1', 'ArrowDown')
    expect(active(2)).toBe('1')
  })

  it('names an omitted timeline Timeline and lets aria-labelledby suppress that name', () => {
    show(
      <>
        <Timeline />
        <Timeline aria-label="History" />
        <Timeline aria-label="History" aria-labelledby="history-title" />
      </>
    )
    const roots = [...document.querySelectorAll('[data-slot="timeline"]')]
    expect(roots.map((node) => node.getAttribute('aria-label'))).toEqual(['Timeline', 'History', null])
    expect(roots[2]?.getAttribute('aria-labelledby')).toBe('history-title')
  })
})
