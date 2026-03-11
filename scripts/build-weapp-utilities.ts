import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const TOKENS_CSS = path.join(ROOT_DIR, 'packages/tokens/dist/tailwind.css')
const SHARED_STYLES = path.join(ROOT_DIR, 'packages/core/src/styles')
const OUTPUT_FILE = path.join(ROOT_DIR, 'packages/weapp/src/utilities.wxss')
const TEMP_INPUT = path.join(ROOT_DIR, 'temp-weapp-input.css')

// 1. Verify Tokens exist
if (!fs.existsSync(TOKENS_CSS)) {
  console.error('Error: packages/tokens/dist/tailwind.css not found. Build tokens first.')
  process.exit(1)
}

// 2. Create Temp Input CSS
// Note: We used relative path for @source in the plan, but absolute is safer if we run from root.
// Tailwind v4 @source supports glob.
const inputContent = `
@import "tailwindcss";
@plugin "tailwindcss-animate";
@import "${TOKENS_CSS}";
@source "${SHARED_STYLES}/**/*.ts";
@source "${path.join(ROOT_DIR, 'packages/weapp/src')}/**/*.{ts,wxml,json}";

/* Disable preflight for Weapp as it targets HTML tags */
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-width: 0;
    border-style: solid;
    border-color: var(--color-border, currentColor);
  }
}
`

fs.writeFileSync(TEMP_INPUT, inputContent)

// 3. Run Tailwind CLI
console.log('Building Tailwind Utilities for Weapp...')
try {
  // Requires 'tailwindcss' and '@tailwindcss/cli' package availability
  // Using npx or project level binary. Assuming 'pnpm tailwindcss' works.
  execSync(`pnpm tailwindcss -i ${TEMP_INPUT} -o ${OUTPUT_FILE}`, { stdio: 'inherit' })
} catch (e) {
  console.error('Failed to run tailwindcss')
  process.exit(1)
}

// 4. Post-process for Weapp
console.log('Post-processing for Weapp (Hover classes)...')
let css = fs.readFileSync(OUTPUT_FILE, 'utf-8')

// Replace .hover\:bg-primary:hover with .hover-bg-primary
// Logic:
// 1. Find selectors with \:hover
// 2. Remove the :hover pseudo-class
// 3. Replace \: with -
// Note: Regex approach
// Regex to match a CSS rule block is complex, but we mainly care about the selector.
// However, Tailwind output is minified-ish.
// A simpler approach: Replace all occurrences of `\:hover` with `-hover` AND remove the `:hover` suffix from selectors.
// CAUTION: This might be brittle.
// Example: `.hover\:bg-primary:hover` -> `.hover-bg-primary`
// Example: `.group:hover .group-hover\:text-white` -> Weapp doesn't support group-hover well in this way without wxml changes.
// For now, let's focus on simple hover.

// Replace escaped colon
css = css.replace(/\\:hover/g, '-hover')
// Remove pseudo-class :hover on the selector
// Note: This replaces ALL :hover. Be careful if there are other usages.
// Tailwind utilities generally use :hover at end of selector.
css = css.replace(/:hover/g, '')

// Also clean up other escapes if needed
// Weapp supports .w-1\/2 for 1/2? No.
// Replace \/ with - or _
css = css.replace(/\\\//g, '-') // .w-1\/2 -> .w-1-2

fs.writeFileSync(OUTPUT_FILE, css)
fs.unlinkSync(TEMP_INPUT)

console.log(`Successfully generated ${OUTPUT_FILE}`)
