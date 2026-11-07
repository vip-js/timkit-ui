import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Stepper from './stepper.vue'
import StepperItem from './stepper-item.vue'
import StepperTrigger from './stepper-trigger.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const item = (step: number) => document.querySelectorAll('[data-slot="stepper-item"]')[step] as HTMLElement
const trigger = (step: number) => document.querySelectorAll('[data-slot="stepper-trigger"]')[step] as HTMLButtonElement

describe('vue stepper select', () => {
  it('follows a later step and ignores a disabled step', async () => {
    const step = ref(0)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (step.value = 1) }, 'Next'),
              h('button', { type: 'button', onClick: () => (step.value = 2) }, 'Pay'),
              h(Stepper, { modelValue: step.value }, () => [
                h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
                h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
                h(StepperItem, { step: 2, disabled: true }, () => h(StepperTrigger, () => 'Pay')),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('active')
    expect(trigger(0).getAttribute('aria-current')).toBe('step')
    expect(trigger(1).getAttribute('aria-current')).toBeNull()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Step 1 of 3')
    const pay = trigger(2)
    const key = Object.keys(pay).find((name) => name.startsWith('__vue'))
    const props = key
      ? (pay as unknown as Record<string, { props?: { onClick?: () => void } }>)[key]?.props
      : undefined
    props?.onClick?.()
    pay.click()
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('active')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(trigger(1).getAttribute('aria-current')).toBe('step')
    expect(trigger(0).getAttribute('aria-current')).toBeNull()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Step 2 of 3')
    press('Pay')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(item(2).getAttribute('data-state')).toBe('active')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Step 3 of 3')
  })

  it('selects a step and ignores a disabled step', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Stepper, { defaultValue: 0, onChange: (value: number) => seen.push(value) }, () => [
          h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
          h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
          h(StepperItem, { step: 2, disabled: true }, () => h(StepperTrigger, () => 'Pay')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('active')
    trigger(1).click()
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(item(0).getAttribute('data-state')).toBe('completed')
    expect(seen).toEqual([1])
    const key = Object.keys(trigger(2)).find((name) => name.startsWith('__vue'))
    const props = key
      ? (trigger(2) as unknown as Record<string, { props?: { onClick?: () => void } }>)[key]?.props
      : undefined
    props?.onClick?.()
    trigger(2).click()
    await nextTick()
    expect(trigger(2).disabled).toBe(true)
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([1])
  })

  it('stays inactive when the model is null even if the default is step 0', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Stepper,
          { modelValue: null, defaultValue: 0, onChange: (value: number) => seen.push(value) },
          () => [
            h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
            h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
          ]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('inactive')
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    trigger(1).click()
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('inactive')
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    expect(seen).toEqual([1])
  })

  it('ignores step changes while the stepper is read-only', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Stepper, { defaultValue: 0, readOnly: true, onChange: (value: number) => seen.push(value) }, () => [
          h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
          h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="stepper"]')?.getAttribute('aria-readonly')).toBe('true')
    expect(trigger(1).disabled).toBe(true)
    const key = Object.keys(trigger(1)).find((name) => name.startsWith('__vue'))
    const props = key
      ? (trigger(1) as unknown as Record<string, { props?: { onClick?: () => void } }>)[key]?.props
      : undefined
    props?.onClick?.()
    trigger(1).click()
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([])
  })

  it('is horizontal unless orientation is vertical', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Stepper, () => [h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account'))]),
          h(Stepper, { orientation: 'vertical' }, () => [
            h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = host.querySelectorAll('[data-slot="stepper"]')
    expect(roots[0]?.getAttribute('data-orientation')).toBe('horizontal')
    expect(roots[0]?.getAttribute('role')).toBe('group')
    expect(roots[0]?.getAttribute('aria-label')).toBe('Stepper')
    expect(roots[1]?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('keeps the active step inside min and max', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Stepper, { defaultValue: 0, max: 1 }, () => [
          h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
          h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
          h(StepperItem, { step: 2 }, () => h(StepperTrigger, () => 'Pay')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    trigger(2).click()
    await nextTick()
    expect(item(0).getAttribute('data-state')).toBe('active')
    trigger(1).click()
    await nextTick()
    expect(item(1).getAttribute('data-state')).toBe('active')
  })

  it('selects the next enabled step with the axis arrows and Home or End', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Stepper, { defaultValue: 0 }, () => [
            h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
            h(StepperItem, { step: 1, disabled: true }, () => h(StepperTrigger, () => 'Ship')),
            h(StepperItem, { step: 2 }, () => h(StepperTrigger, () => 'Pay')),
          ]),
          h(Stepper, { orientation: 'vertical', defaultValue: 0 }, () => [
            h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
            h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
          ]),
          h(Stepper, { readOnly: true, defaultValue: 0 }, () => [
            h(StepperItem, { step: 0 }, () => h(StepperTrigger, () => 'Account')),
            h(StepperItem, { step: 1 }, () => h(StepperTrigger, () => 'Ship')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = () => host.querySelectorAll('[data-slot="stepper"]')
    const active = (index: number) =>
      [...(roots()[index]?.querySelectorAll('[data-slot="stepper-item"]') ?? [])].findIndex(
        (node) => node.getAttribute('data-state') === 'active'
      )
    const press = async (index: number, step: string, key: string) => {
      roots()[index]?.querySelector(`[data-step="${step}"]`)?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await press(0, '0', 'ArrowRight')
    expect(active(0)).toBe(2)
    await press(0, '2', 'ArrowRight')
    expect(active(0)).toBe(2)
    await press(0, '2', 'ArrowDown')
    expect(active(0)).toBe(2)
    await press(0, '2', 'Home')
    expect(active(0)).toBe(0)
    await press(0, '0', 'End')
    expect(active(0)).toBe(2)
    await press(1, '0', 'ArrowDown')
    expect(active(1)).toBe(1)
    await press(1, '1', 'ArrowRight')
    expect(active(1)).toBe(1)
    await press(2, '0', 'ArrowRight')
    expect(active(2)).toBe(0)
  })
})
