import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'

const ROOT = path.resolve(__dirname, '..')
const cjsEntry = path.join(ROOT, 'packages/html/dist/index.js')
const esmEntry = path.join(ROOT, 'packages/html/dist/index.mjs')

async function main() {
  const require = createRequire(import.meta.url)
  const cjsRuntime = require(cjsEntry)
  const esmRuntime = await import(pathToFileURL(esmEntry).href)

  assert.equal(typeof cjsRuntime.initHtmlRuntime, 'function')
  assert.equal(typeof cjsRuntime.autoInitHtmlRuntime, 'function')
  assert.equal(typeof esmRuntime.initHtmlRuntime, 'function')
  assert.equal(typeof esmRuntime.autoInitHtmlRuntime, 'function')
  assert.equal(cjsRuntime.htmlRuntimeCapabilities.length, 13)
  assert.equal(esmRuntime.htmlRuntimeCapabilities.length, 13)

  const dom = new JSDOM(
    `
      <div data-timui-root data-timui-init="auto">
        <div data-slot="tabs">
          <div data-slot="tabs-list">
            <button data-slot="tabs-trigger" data-state="active">One</button>
            <button data-slot="tabs-trigger" data-state="inactive">Two</button>
          </div>
          <div data-slot="tabs-content" data-state="active">Alpha</div>
          <div data-slot="tabs-content" data-state="inactive" hidden>Beta</div>
        </div>
      </div>
    `,
    { url: 'http://localhost' }
  )

  const { document } = dom.window
  cjsRuntime.autoInitHtmlRuntime({ document, immediate: true })

  const triggers = Array.from(document.querySelectorAll('[data-slot="tabs-trigger"]'))
  const contents = Array.from(document.querySelectorAll('[data-slot="tabs-content"]'))
  assert.equal(triggers[0]?.getAttribute('data-state'), 'active')
  assert.equal(triggers[1]?.getAttribute('data-state'), 'inactive')
  assert.equal(contents[0]?.hidden, false)
  assert.equal(contents[1]?.hidden, true)

  triggers[1]?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))

  assert.equal(triggers[0]?.getAttribute('data-state'), 'inactive')
  assert.equal(triggers[1]?.getAttribute('data-state'), 'active')
  assert.equal(contents[0]?.hidden, true)
  assert.equal(contents[1]?.hidden, false)

  console.log('HTML runtime smoke: PASS')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
