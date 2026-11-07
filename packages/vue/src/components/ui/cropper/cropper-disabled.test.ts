import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { Cropper, CropperCropArea, CropperImage } from './cropper.vue'

class ResizeObserverStub {
  constructor(private readonly callback: () => void) {}
  observe() {
    this.callback()
  }
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() {
    return 240
  },
})
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  get() {
    return 240
  },
})

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (disabled = false) => {
  const areas: Array<{ x: number } | null> = []
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Cropper, { image: 'photo.png', disabled, onCropChange: (area: { x: number } | null) => areas.push(area) }, () => [
        h(CropperImage),
        h(CropperCropArea),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
  const image = document.querySelector('[data-slot="cropper-image"]') as HTMLImageElement
  Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 400 })
  Object.defineProperty(image, 'naturalHeight', { configurable: true, value: 300 })
  image.dispatchEvent(new Event('load'))
  await nextTick()
  return areas
}

const drag = () => {
  const cropper = document.querySelector('[data-slot="cropper"]') as HTMLElement
  cropper.dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, pointerId: 1, clientX: 20, clientY: 20 })
  )
  window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 1, clientX: 90, clientY: 20 }))
  window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 90, clientY: 20 }))
}

describe('vue cropper', () => {
  it('follows a later image and ignores a drag while disabled', async () => {
    const image = ref('photo.png')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (image.value = 'next.png') }, 'Swap'),
              h(Cropper, { image: image.value, disabled: true }, () => [h(CropperImage), h(CropperCropArea)]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const shown = () => (document.querySelector('[data-slot="cropper-image"]') as HTMLImageElement).getAttribute('src')
    expect(shown()).toBe('photo.png')
    drag()
    await nextTick()
    expect(shown()).toBe('photo.png')
    const swap = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Swap')
    swap?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(shown()).toBe('next.png')
  })

  it('moves the crop when dragged and ignores the drag while disabled', async () => {
    const enabled = await show()
    const before = enabled.at(-1)
    drag()
    await nextTick()
    expect(enabled.at(-1)?.x).not.toBe(before?.x)

    document.body.innerHTML = ''
    const disabled = await show(true)
    const stayed = disabled.at(-1)
    drag()
    await nextTick()
    expect(disabled.at(-1)).toEqual(stayed)
  })

  it('reports one zoom and one crop when zooming in', async () => {
    const zooms: number[] = []
    const crops: Array<{ x: number } | null> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Cropper,
          {
            image: 'photo.png',
            onZoomChange: (zoom: number) => zooms.push(zoom),
            onCropChange: (area: { x: number } | null) => crops.push(area),
          },
          () => [h(CropperImage), h(CropperCropArea)]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const image = document.querySelector('[data-slot="cropper-image"]') as HTMLImageElement
    Object.defineProperty(image, 'naturalWidth', { configurable: true, value: 400 })
    Object.defineProperty(image, 'naturalHeight', { configurable: true, value: 300 })
    image.dispatchEvent(new Event('load'))
    await nextTick()
    zooms.length = 0
    crops.length = 0
    const cropper = document.querySelector('[data-slot="cropper"]') as HTMLElement
    expect(cropper.getAttribute('aria-label')).toBe('Interactive image cropper')
    expect(cropper.getAttribute('role')).toBe('application')
    cropper.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true, cancelable: true }))
    await nextTick()
    expect(zooms).toHaveLength(1)
    expect(crops).toHaveLength(1)
    expect(zooms[0]).toBeGreaterThan(1)
  })

  it('sizes the crop area from aspect', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Cropper, { image: 'photo.png', aspect: 2 }, () => [h(CropperImage), h(CropperCropArea)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const area = document.querySelector('[data-slot="cropper-crop-area"]') as HTMLElement
    expect(area.style.width).toBe('208px')
    expect(area.style.height).toBe('104px')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2 to 1')
    const plain = document.createElement('div')
    document.body.append(plain)
    const plainApp = createApp({
      render: () => h(Cropper, { image: 'photo.png' }, () => [h(CropperImage), h(CropperCropArea)]),
    })
    plainApp.mount(plain)
    mounted.push({ unmount: () => plainApp.unmount(), host: plain })
    await nextTick()
    expect(plain.querySelector('[role="status"]')).toBeNull()
  })
})
