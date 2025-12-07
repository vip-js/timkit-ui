import fs from 'fs'
import path from 'path'

import { categories } from '../config/components'
import sections from '../sections/sections.json'

const OUTPUT_DIR = path.join(process.cwd(), 'catalog')
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'catalog.json')

const main = () => {
  const payload = {
    generatedAt: new Date().toISOString(),
    categories,
    sections,
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2))
  // eslint-disable-next-line no-console
  console.log(`Catalog written to ${path.relative(process.cwd(), OUTPUT_FILE)}`)
}

main()
