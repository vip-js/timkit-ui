// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Cropper, CropperCropArea, CropperImage } from './cropper'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

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

const press = (disabled: boolean) => {
  const frame = document.querySelector('[data-slot="cropper-frame"]') as HTMLElement
  const cropper = frame.querySelector('[data-slot="cropper"]') as HTMLElement
  let reached = false
  cropper.addEventListener('mousedown', () => {
    reached = true
  })
  act(() => {
    frame.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    cropper.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
  })
  expect(frame.getAttribute('aria-disabled')).toBe(disabled ? 'true' : null)
  expect(reached).toBe(!disabled)
}

describe('cropper disabled', () => {
  it('follows a later image and blocks a pointer while disabled', () => {
    function Harness() {
      const [image, setImage] = useState('photo.png')
      return (
        <>
          <button type="button" onClick={() => setImage('next.png')}>
            Swap
          </button>
          <Cropper image={image} disabled>
            <CropperImage />
            <CropperCropArea />
          </Cropper>
        </>
      )
    }
    show(<Harness />)
    const shown = () =>
      (document.querySelector('[data-slot="cropper-image"]') as HTMLImageElement).getAttribute('src')
    expect(shown()).toBe('photo.png')
    press(true)
    const swap = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Swap')
    act(() => swap?.click())
    expect(shown()).toBe('next.png')
  })

  it('lets a pointer reach the cropper and blocks it while disabled', () => {
    show(
      <Cropper image="photo.png">
        <CropperImage />
        <CropperCropArea />
      </Cropper>
    )
    expect(document.querySelector('[data-slot="cropper"]')?.getAttribute('aria-label')).toBe(
      'Interactive image cropper'
    )
    press(false)
    document.body.innerHTML = ''
    show(
      <Cropper image="photo.png" disabled>
        <CropperImage />
        <CropperCropArea />
      </Cropper>
    )
    press(true)
  })

  it('sizes the crop area from aspect', () => {
    const width = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const height = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 240 })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get: () => 240 })
    try {
      show(
        <Cropper image="photo.png" aspect={2}>
          <CropperImage />
          <CropperCropArea />
        </Cropper>
      )
      const area = document.querySelector('[data-slot="cropper-crop-area"]') as HTMLElement
      expect(area.style.width).toBe('190px')
      expect(area.style.height).toBe('95px')
      expect(document.querySelector('[data-slot="cropper-frame"] [role="status"]')?.textContent).toBe('2 to 1')
      show(
        <Cropper image="photo.png">
          <CropperImage />
          <CropperCropArea />
        </Cropper>
      )
      const frames = document.querySelectorAll('[data-slot="cropper-frame"]')
      expect(frames[frames.length - 1]?.querySelector('[role="status"]')).toBeNull()
    } finally {
      if (width) Object.defineProperty(HTMLElement.prototype, 'clientWidth', width)
      else delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth
      if (height) Object.defineProperty(HTMLElement.prototype, 'clientHeight', height)
      else delete (HTMLElement.prototype as { clientHeight?: number }).clientHeight
    }
  })
})
