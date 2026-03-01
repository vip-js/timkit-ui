const { spawnSync } = require('child_process')
const { packages, shared } = require('./packages.config.cjs')

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

const command = process.argv[2] || 'build'
const requested = process.argv.slice(3)
const names = packages.map((pkg) => pkg.name)
const targets =
  requested.length === 0 ? packages : packages.filter((pkg) => requested.includes(pkg.name))

if (!targets.length) {
  console.error('No matching packages. Available:', names.join(', '))
  process.exit(1)
}

run('pnpm', ['--filter', shared.tokens, 'run', 'build'])

targets.forEach((pkg) => {
  if (command === 'release') {
    run('pnpm', ['--filter', pkg.filter, 'run', 'build'])
    run('pnpm', ['--filter', pkg.filter, 'publish', '--access', 'public', '--no-git-checks'])
    return
  }
  run('pnpm', ['--filter', pkg.filter, 'run', 'build'])
})
