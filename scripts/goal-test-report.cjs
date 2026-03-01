const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(ROOT, 'packages')
const TESTS_DIR = path.join(ROOT, 'tests')
const TEST_FILE_RE = /\.(test|spec)\.(ts|tsx|js|jsx)$/

function walkFiles(dir, out) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'dist' || entry.name === 'node_modules') continue
      walkFiles(full, out)
      continue
    }
    if (TEST_FILE_RE.test(entry.name)) {
      out.push(full)
    }
  }
}

function run() {
  const files = []
  walkFiles(PACKAGES_DIR, files)
  walkFiles(TESTS_DIR, files)

  console.log('Timkit Goal Test Report')
  console.log('=======================')
  console.log(`Detected test files: ${files.length}`)

  if (files.length === 0) {
    console.log('No test files found; goal:test requires at least one test file.')
    process.exit(1)
  }

  const preview = files.slice(0, 20).map((file) => path.relative(ROOT, file))
  preview.forEach((item) => console.log(`- ${item}`))
  if (files.length > preview.length) {
    console.log(`...and ${files.length - preview.length} more`)
  }

  const result = spawnSync('node', ['--import', 'tsx', 'scripts/goal-smoke-tests.ts'], {
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

run()
