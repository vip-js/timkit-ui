import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { semantic, tokens } from './src/theme'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.join(__dirname, 'dist')

function toCssVarName(path: string[]): string {
  return `--${path.join('-')}`
}

type TokenTree = {
  [key: string]: string | TokenTree
}

function processTokens(
  obj: TokenTree,
  prefix: string[] = [],
  callback: (path: string[], value: string) => void
) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...prefix, key]
    if (typeof value === 'string') {
      callback(currentPath, value)
    } else if (typeof value === 'object' && value !== null) {
      processTokens(value, currentPath, callback)
    }
  }
}

function build() {
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true })
  }

  const cssVars: string[] = []
  const wxssVars: string[] = []
  const themeEntries: string[] = []

  processTokens(semantic, [], (path, value) => {
    const varName = toCssVarName(path)
    cssVars.push(`${varName}: ${value};`)
    wxssVars.push(`${varName}: ${value};`)

    // Tailwind v4 @theme mapping
    if (!path.includes('radius')) {
      themeEntries.push(`--color-${path.join('-')}: var(${varName});`)
    } else {
      themeEntries.push(`--${path.join('-')}: var(${varName});`)
    }
  })

  // 1. theme.css (Native CSS Variables)
  const cssContent = `:root {\n  ${cssVars.join('\n  ')}\n}\n`
  fs.writeFileSync(path.join(DIST_DIR, 'theme.css'), cssContent)

  // 2. theme.wxss (WeChat Miniprogram)
  const wxssContent = `page {\n  ${wxssVars.join('\n  ')}\n}\n`
  fs.writeFileSync(path.join(DIST_DIR, 'theme.wxss'), wxssContent)

  // 3. tailwind.css (Tailwind v4 @theme configuration)
  const tailwindContent = `@theme {\n  ${themeEntries.join('\n  ')}\n}\n`
  fs.writeFileSync(path.join(DIST_DIR, 'tailwind.css'), tailwindContent)

  // 4. JSON
  const serializedTokens = JSON.stringify(tokens, null, 2)
  fs.writeFileSync(path.join(DIST_DIR, 'tokens.json'), serializedTokens)

  // Runtime JS keeps Node CJS/ESM consumers independent from JSON import
  // assertion syntax, which differs across supported Node versions.
  fs.writeFileSync(
    path.join(DIST_DIR, 'tokens.mjs'),
    `const tokens = ${serializedTokens}\n\nexport default tokens\n`
  )
  fs.writeFileSync(path.join(DIST_DIR, 'tokens.js'), `module.exports = ${serializedTokens}\n`)
  fs.writeFileSync(
    path.join(DIST_DIR, 'tokens.d.ts'),
    `type TokenTree = { [key: string]: string | TokenTree }\n\n` +
      `declare const tokens: { palette: TokenTree; semantic: TokenTree }\nexport default tokens\n`
  )

  console.log('Tokens built successfully (css, wxss, tailwind, json)!')
}

build()
