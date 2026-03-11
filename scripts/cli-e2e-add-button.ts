import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const CLI_ENTRY = path.join(ROOT, 'packages/cli/dist/index.js')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'timkit-cli-e2e-'))

const run = (args: string[], cwd = ROOT) => {
  const result = spawnSync(process.execPath, [CLI_ENTRY, ...args], {
    cwd,
    encoding: 'utf-8',
    env: {
      ...process.env,
      TIMUI_CACHE_DIR: path.join(tmp, '.timui-cache'),
    },
  })
  return result
}

if (!fs.existsSync(CLI_ENTRY)) {
  console.error('❌ CLI dist not found. Run `pnpm --filter @timui/cli run build` first.')
  process.exit(1)
}

fs.mkdirSync(path.join(tmp, 'components', 'ui'), { recursive: true })

const first = run(['add', 'button', '--yes', '--no-install', '--diff', '--cwd', tmp], ROOT)
if (first.status !== 0) {
  console.error('❌ CLI diff mode failed.')
  process.stderr.write(first.stderr || '')
  process.stdout.write(first.stdout || '')
  process.exit(first.status ?? 1)
}

const second = run(
  [
    'add',
    'button',
    '--yes',
    '--no-install',
    '--framework',
    'react',
    '--path',
    'components/ui',
    '--cwd',
    tmp,
  ],
  ROOT
)
if (second.status !== 0) {
  console.error('❌ CLI write mode failed.')
  process.stderr.write(second.stderr || '')
  process.stdout.write(second.stdout || '')
  process.exit(second.status ?? 1)
}

const generatedButton = path.join(tmp, 'components', 'ui', 'button.tsx')
if (!fs.existsSync(generatedButton)) {
  console.error(`❌ Expected generated file not found: ${generatedButton}`)
  process.exit(1)
}

console.log('✅ CLI e2e passed: `add button` can resolve registry and generate files.')
