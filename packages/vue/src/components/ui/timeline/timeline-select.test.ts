import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Timeline from './timeline.vue'
import TimelineItem from './timeline-item.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const item = (step: number) =>
  document.querySelectorAll('[data-slot="timeline-item"]')[step - 1] as HTMLElement

describe('vue timeline select', () => {
  it('selects a step and ignores a disabled step', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Timeline,
          { defaultValue: 1, onValueChange: (value: number) => seen.push(value) },
          () => [
            h(TimelineItem, { step: 1 }, () => 'One'),
            h(TimelineItem, { step: 2 }, () => 'Two'),
            h(TimelineItem, { step: 3, disabled: true }, () => 'Three'),
          ]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Step 1 of 3')
    item(2).click()
    await nextTick()
    expect(item(2).getAttribute('data-state')).toBe('active')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Step 2 of 3')
    expect(item(1).getAttribute('data-state')).toBe('completed')
    expect(seen).toEqual([2])
    item(3).click()
    await nextTick()
    expect(item(2).getAttribute('data-state')).toBe('active')
    expect(item(3).getAttribute('aria-disabled')).toBe('true')
    expect(item(2).getAttribute('role')).toBe('button')
    expect(seen).toEqual([2])
    item(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([2, 1])
    item(3).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([2, 1])
  })

  it('stays inactive when the model is null even if the default is the first step', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Timeline,
          { modelValue: null, defaultValue: 1, onValueChange: (value: number) => seen.push(value) },
          () => [h(TimelineItem, { step: 1 }, () => 'One'), h(TimelineItem, { step: 2 }, () => 'Two')]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    expect(host.querySelector('[role="status"]')).toBeNull()
    item(2).click()
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    expect(item(2).getAttribute('data-state')).toBe('inactive')
    expect(seen).toEqual([2])
  })

  it('ignores step changes while the timeline is disabled', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Timeline,
          { defaultValue: 1, disabled: true, onValueChange: (value: number) => seen.push(value) },
          () => [h(TimelineItem, { step: 1 }, () => 'One'), h(TimelineItem, { step: 2 }, () => 'Two')]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="timeline"]')?.getAttribute('aria-disabled')).toBe('true')
    item(2).click()
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(item(2).getAttribute('aria-disabled')).toBe('true')
    expect(seen).toEqual([])
  })

  it('is vertical unless orientation is horizontal', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Timeline, () => [h(TimelineItem, { step: 1 }, () => 'One')]),
          h(Timeline, { orientation: 'horizontal' }, () => [h(TimelineItem, { step: 1 }, () => 'One')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = host.querySelectorAll('[data-slot="timeline"]')
    expect(roots[0]?.getAttribute('data-orientation')).toBe('vertical')
    expect(roots[1]?.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('selects the next enabled step with the axis arrows and Home or End', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Timeline, { defaultValue: 1 }, () => [
            h(TimelineItem, { step: 1 }, () => 'One'),
            h(TimelineItem, { step: 2, disabled: true }, () => 'Two'),
            h(TimelineItem, { step: 3 }, () => 'Three'),
          ]),
          h(Timeline, { orientation: 'horizontal', defaultValue: 1 }, () => [
            h(TimelineItem, { step: 1 }, () => 'One'),
            h(TimelineItem, { step: 2 }, () => 'Two'),
          ]),
          h(Timeline, { disabled: true, defaultValue: 1 }, () => [
            h(TimelineItem, { step: 1 }, () => 'One'),
            h(TimelineItem, { step: 2 }, () => 'Two'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = () => host.querySelectorAll('[data-slot="timeline"]')
    const active = (index: number) => roots()[index]?.querySelector('[aria-current="step"]')?.getAttribute('data-step')
    const press = async (index: number, step: string, key: string) => {
      roots()[index]?.querySelector(`[data-step="${step}"]`)?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await press(0, '1', 'ArrowDown')
    expect(active(0)).toBe('3')
    await press(0, '3', 'ArrowDown')
    expect(active(0)).toBe('3')
    await press(0, '3', 'ArrowRight')
    expect(active(0)).toBe('3')
    await press(0, '3', 'Home')
    expect(active(0)).toBe('1')
    await press(0, '1', 'End')
    expect(active(0)).toBe('3')
    await press(1, '1', 'ArrowRight')
    expect(active(1)).toBe('2')
    await press(1, '2', 'ArrowDown')
    expect(active(1)).toBe('2')
    await press(2, '1', 'ArrowDown')
    expect(active(2)).toBe('1')
  })

  it('names an omitted timeline Timeline and lets aria-labelledby suppress that name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Timeline),
          h(Timeline, { 'aria-label': 'History' }),
          h(Timeline, { 'aria-label': 'History', 'aria-labelledby': 'history-title' }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = [...host.querySelectorAll('[data-slot="timeline"]')]
    expect(roots.map((node) => node.getAttribute('aria-label'))).toEqual(['Timeline', 'History', null])
    expect(roots[2]?.getAttribute('aria-labelledby')).toBe('history-title')
  })
})
