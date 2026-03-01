const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const HTML_DIR = path.join(ROOT, 'apps/docs/registry/default/html')
const WEAPP_DIR = path.join(ROOT, 'apps/docs/registry/default/weapp')

const variants = ['']
for (let index = 1; index <= 20; index += 1) {
  variants.push(String(index).padStart(2, '0'))
}

const htmlTemplate = (name) => `
<section class="mx-auto max-w-3xl space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-100">
  <!-- ${name} -->
  ${[1, 2, 3]
    .map(
      (itemIndex) => `
  <div class="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
    <button class="w-full flex items-center justify-between px-4 py-3 text-left font-semibold transition hover:bg-zinc-900">
      <span>Accordion ${name || 'base'} · Panel ${itemIndex}</span>
      <span aria-hidden="true">⌄</span>
    </button>
    <div class="px-4 pb-4 text-zinc-300">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Panel ${itemIndex} content goes here.
    </div>
  </div>
`
    )
    .join('')
  }
</section>
`.trim() + '\n'

const weappTemplate = (name) => `
<view class="accordion">
  <!-- ${name} -->
  ${[1, 2, 3]
    .map(
      (itemIndex) => `
  <view class="accordion-item">
    <view class="accordion-trigger">Accordion ${name || 'base'} · Panel ${itemIndex}</view>
    <view class="accordion-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Panel ${itemIndex} content goes here.
    </view>
  </view>
`
    )
    .join('')
  }
</view>
`.trim() + '\n'

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const run = () => {
  ensureDir(HTML_DIR)
  ensureDir(WEAPP_DIR)

  variants.forEach((variant) => {
    const suffix = variant ? `-${variant}` : ''
    const htmlPath = path.join(HTML_DIR, `accordion${suffix}.html`)
    const weappPath = path.join(WEAPP_DIR, `accordion${suffix}.wxml`)

    fs.writeFileSync(htmlPath, htmlTemplate(variant || 'base'), 'utf-8')
    fs.writeFileSync(weappPath, weappTemplate(variant || 'base'), 'utf-8')
  })
}

run()
