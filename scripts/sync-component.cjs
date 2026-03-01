const { spawnSync } = require('child_process')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const { components } = require('./component-sync.config.cjs')

const listComponents = () => {
  const entries = Object.entries(components)
  if (!entries.length) {
    console.log('No components configured.')
    return
  }
  console.log('Available components:')
  entries.forEach(([name, config]) => {
    const description = config.description ? ` - ${config.description}` : ''
    console.log(`- ${name}${description}`)
  })
}

const runScript = (componentName, args) => {
  const scriptName = components[componentName]?.script
  if (!scriptName) {
    console.error(`Unknown component: ${componentName}`)
    listComponents()
    process.exit(1)
  }
  const scriptPath = path.join(ROOT, 'scripts', scriptName)
  const result = spawnSync(process.execPath, [scriptPath, ...args], { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const name = process.argv[2]
const extraArgs = process.argv.slice(3)

if (!name || name === 'list' || name === '--list') {
  listComponents()
  process.exit(0)
}

if (name === 'all' || name === '--all') {
  Object.keys(components).forEach((componentName) => {
    runScript(componentName, extraArgs)
  })
  process.exit(0)
}

runScript(name, extraArgs)
