import fs from 'fs'
import path from 'path'

import { resolveDemoDisplayTitleDetail } from '../apps/docs/lib/demo-title'

type Reason = 'explicit' | 'heading' | 'heuristic' | 'pattern'

const ROOT = path.resolve(__dirname, '..')
const REGISTRY_DIR = path.join(ROOT, 'apps/docs/public/registry')

const files = fs
  .readdirSync(REGISTRY_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => path.join(REGISTRY_DIR, file))

const countByReason: Record<Reason, number> = {
  explicit: 0,
  heading: 0,
  heuristic: 0,
  pattern: 0,
}

const fallbackItems: Array<{ name: string; title: string }> = []
let totalDemos = 0

for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(file, 'utf-8')) as {
    name: string
    files?: Array<{ path: string; content?: string }>
    meta?: { title?: string; category?: string }
  }

  if (!payload?.name || !/-\d{1,3}$/.test(payload.name)) continue
  totalDemos += 1

  const componentSlug = payload.name.replace(/-\d{1,3}$/, '')
  const result = resolveDemoDisplayTitleDetail(
    componentSlug,
    payload.name,
    payload.files || [],
    payload.meta?.title
  )

  countByReason[result.reason] += 1
  if (result.reason === 'pattern') {
    fallbackItems.push({ name: payload.name, title: result.title })
  }
}

const semanticCount = countByReason.explicit + countByReason.heading + countByReason.heuristic
const semanticRate = totalDemos ? ((semanticCount / totalDemos) * 100).toFixed(2) : '0.00'

console.log('Timkit Demo Title Coverage')
console.log('==========================')
console.log(`Total demos: ${totalDemos}`)
console.log(`Semantic coverage: ${semanticCount}/${totalDemos} (${semanticRate}%)`)
console.log(
  `Breakdown: explicit=${countByReason.explicit}, heading=${countByReason.heading}, heuristic=${countByReason.heuristic}, pattern=${countByReason.pattern}`
)

if (fallbackItems.length) {
  console.log('\nFallback pattern items (sample 80):')
  fallbackItems.slice(0, 80).forEach((item) => {
    console.log(`- ${item.name} => ${item.title}`)
  })
}
