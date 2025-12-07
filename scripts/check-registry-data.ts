import fs from 'fs'
import path from 'path'

import { registryPayloadSchema } from '../packages/core/src/schema'
import { sha256OfString } from '../packages/cli/src/lib/checksum'

const ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(ROOT, 'apps/docs/data/registry-all.json')
const MAX_AGE_DAYS = 3

function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error('❌ registry-all.json is missing. Run pnpm --filter @timui/docs registry:build:all')
    process.exit(1)
  }
  const stat = fs.statSync(DATA_FILE)
  const ageDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24)
  if (ageDays > MAX_AGE_DAYS) {
    console.warn(
      `⚠️  registry-all.json is ${ageDays.toFixed(
        1
      )} days old. Consider re-running pnpm --filter @timui/docs registry:build:all.`
    )
  }

  try {
    const json = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    const result = registryPayloadSchema.safeParse(json)
    if (!result.success) {
      console.error('❌ registry-all.json schema invalid:', result.error?.message)
      process.exit(1)
    }
    if (!json.checksum) {
      console.warn('⚠️  registry-all.json missing checksum field.')
    } else {
      const { checksum, ...rest } = json as any
      const recomputed = sha256OfString(JSON.stringify(rest, null, 2))
      if (recomputed !== checksum) {
        console.error('❌ registry-all.json checksum mismatch. Please rebuild registry.')
        console.error(`stored:    ${checksum}`)
        console.error(`computed:  ${recomputed}`)
        process.exit(1)
      }
    }
  } catch (e) {
    console.error('❌ Failed to parse registry-all.json', e)
    process.exit(1)
  }
}

main()
