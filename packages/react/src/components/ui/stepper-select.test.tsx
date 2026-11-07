// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Stepper, StepperItem, StepperTrigger } from './stepper'

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

const item = (step: number) => document.querySelectorAll('[data-slot="stepper-item"]')[step] as HTMLElement
const trigger = (step: number) => document.querySelectorAll('[data-slot="stepper-trigger"]')[step] as HTMLButtonElement

describe('stepper select', () => {
  it('follows a later step and ignores a disabled step', async () => {
    function Harness() {
      const [step, setStep] = useState(0)
      return (
        <>
          <button type="button" onClick={() => setStep(1)}>
            Next
          </button>
          <button type="button" onClick={() => setStep(2)}>
            Pay
          </button>
          <Stepper value={step}>
            <StepperItem step={0}>
              <StepperTrigger>Account</StepperTrigger>
            </StepperItem>
            <StepperItem step={1}>
              <StepperTrigger>Ship</StepperTrigger>
            </StepperItem>
            <StepperItem step={2} disabled>
              <StepperTrigger>Pay</StepperTrigger>
            </StepperItem>
          </Stepper>
        </>
      )
    }
    show(<Harness />)
    expect(item(0).getAttribute('data-state')).toBe('active')
    expect(trigger(0).getAttribute('aria-current')).toBe('step')
    expect(trigger(1).getAttribute('aria-current')).toBeNull()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Step 1 of 3')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    const key = Object.keys(trigger(2)).find((name) => name.startsWith('__reactProps'))
    const handler = key
      ? (trigger(2) as unknown as Record<string, { onClick?: (event: { defaultPrevented: boolean }) => void }>)[key]
          ?.onClick
      : undefined
    await act(async () => {
      handler?.({ defaultPrevented: false })
      await Promise.resolve()
    })
    expect(item(0).getAttribute('data-state')).toBe('active')
    await act(async () => {
      press('Next')?.click()
    })
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(trigger(1).getAttribute('aria-current')).toBe('step')
    expect(trigger(0).getAttribute('aria-current')).toBeNull()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Step 2 of 3')
    await act(async () => {
      press('Pay')?.click()
    })
    expect(item(2).getAttribute('data-state')).toBe('active')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Step 3 of 3')
  })

  it('selects a step and ignores a disabled step', async () => {
    const seen: number[] = []
    show(
      <Stepper
        defaultValue={0}
        onValueChange={(event) => seen.push(event.detail.valueAsNumber)}
      >
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
        <StepperItem step={1}>
          <StepperTrigger>Ship</StepperTrigger>
        </StepperItem>
        <StepperItem step={2} disabled>
          <StepperTrigger>Pay</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    expect(item(0).getAttribute('data-state')).toBe('active')
    await act(async () => {
      trigger(1).click()
      await Promise.resolve()
    })
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(item(0).getAttribute('data-state')).toBe('completed')
    expect(seen).toEqual([1])
    const key = Object.keys(trigger(2)).find((name) => name.startsWith('__reactProps'))
    const handler = key
      ? (trigger(2) as unknown as Record<string, { onClick?: (event: { defaultPrevented: boolean }) => void }>)[key]
          ?.onClick
      : undefined
    await act(async () => {
      handler?.({ defaultPrevented: false })
      await Promise.resolve()
    })
    expect(trigger(2).disabled).toBe(true)
    expect(item(1).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([1])
  })

  it('stays inactive when value is null even if the default is step 0', async () => {
    const seen: number[] = []
    show(
      <Stepper
        value={null as unknown as number}
        defaultValue={0}
        onValueChange={(event) => seen.push(event.detail.valueAsNumber)}
      >
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
        <StepperItem step={1}>
          <StepperTrigger>Ship</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    expect(item(0).getAttribute('data-state')).toBe('inactive')
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    await act(async () => {
      trigger(1).click()
      await Promise.resolve()
    })
    expect(item(0).getAttribute('data-state')).toBe('inactive')
    expect(item(1).getAttribute('data-state')).toBe('inactive')
    expect(seen).toEqual([1])
  })

  it('ignores step changes while the stepper is read-only', async () => {
    const seen: number[] = []
    show(
      <Stepper
        defaultValue={0}
        readOnly
        onValueChange={(event) => seen.push(event.detail.valueAsNumber)}
      >
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
        <StepperItem step={1}>
          <StepperTrigger>Ship</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    expect(document.querySelector('[data-slot="stepper"]')?.getAttribute('aria-readonly')).toBe('true')
    expect(trigger(1).disabled).toBe(true)
    const key = Object.keys(trigger(1)).find((name) => name.startsWith('__reactProps'))
    const handler = key
      ? (trigger(1) as unknown as Record<string, { onClick?: (event: { defaultPrevented: boolean }) => void }>)[key]
          ?.onClick
      : undefined
    await act(async () => {
      handler?.({ defaultPrevented: false })
      await Promise.resolve()
    })
    expect(item(0).getAttribute('data-state')).toBe('active')
    expect(seen).toEqual([])
  })

  it('is horizontal unless orientation is vertical', () => {
    show(
      <Stepper>
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    expect(document.querySelector('[data-slot="stepper"]')?.getAttribute('data-orientation')).toBe('horizontal')
    expect(document.querySelector('[data-slot="stepper"]')?.getAttribute('role')).toBe('group')
    expect(document.querySelector('[data-slot="stepper"]')?.getAttribute('aria-label')).toBe('Stepper')
    document.body.innerHTML = ''
    show(
      <Stepper orientation="vertical">
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    const roots = document.querySelectorAll('[data-slot="stepper"]')
    expect(roots[roots.length - 1]?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('keeps the active step inside min and max', async () => {
    show(
      <Stepper defaultValue={0} max={1}>
        <StepperItem step={0}>
          <StepperTrigger>Account</StepperTrigger>
        </StepperItem>
        <StepperItem step={1}>
          <StepperTrigger>Ship</StepperTrigger>
        </StepperItem>
        <StepperItem step={2}>
          <StepperTrigger>Pay</StepperTrigger>
        </StepperItem>
      </Stepper>
    )
    await act(async () => {
      trigger(2).click()
    })
    expect(item(0).getAttribute('data-state')).toBe('active')
    await act(async () => {
      trigger(1).click()
    })
    expect(item(1).getAttribute('data-state')).toBe('active')
  })

  it('selects the next enabled step with the axis arrows and Home or End', async () => {
    show(
      <>
        <Stepper defaultValue={0}>
          <StepperItem step={0}>
            <StepperTrigger>Account</StepperTrigger>
          </StepperItem>
          <StepperItem step={1} disabled>
            <StepperTrigger>Ship</StepperTrigger>
          </StepperItem>
          <StepperItem step={2}>
            <StepperTrigger>Pay</StepperTrigger>
          </StepperItem>
        </Stepper>
        <Stepper orientation="vertical" defaultValue={0}>
          <StepperItem step={0}>
            <StepperTrigger>Account</StepperTrigger>
          </StepperItem>
          <StepperItem step={1}>
            <StepperTrigger>Ship</StepperTrigger>
          </StepperItem>
        </Stepper>
        <Stepper readOnly defaultValue={0}>
          <StepperItem step={0}>
            <StepperTrigger>Account</StepperTrigger>
          </StepperItem>
          <StepperItem step={1}>
            <StepperTrigger>Ship</StepperTrigger>
          </StepperItem>
        </Stepper>
      </>
    )
    const roots = () => document.querySelectorAll('[data-slot="stepper"]')
    const active = (index: number) =>
      [...(roots()[index]?.querySelectorAll('[data-slot="stepper-item"]') ?? [])].findIndex(
        (node) => node.getAttribute('data-state') === 'active'
      )
    const press = async (index: number, step: string, key: string) => {
      await act(async () => {
        roots()
          [index]?.querySelector(`[data-step="${step}"]`)
          ?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
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
