import { spawnSync } from 'child_process'

type SmokeTask = {
  name: string
  script: string
}

const tasks: SmokeTask[] = [
  { name: 'core-behavior', script: 'scripts/goal-smoke-core.ts' },
  { name: 'registry-consistency', script: 'scripts/goal-smoke-registry.ts' },
  { name: 'preview-protocol', script: 'scripts/goal-smoke-preview-protocol.ts' },
  { name: 'preview-runtime', script: 'scripts/goal-smoke-preview-runtime.ts' },
  { name: 'weapp-semantics', script: 'scripts/goal-smoke-weapp-semantics.ts' },
  { name: 'weapp-runtime', script: 'scripts/goal-smoke-weapp-runtime.ts' },
]

const runTask = (task: SmokeTask) => {
  const result = spawnSync('node', ['--import', 'tsx', task.script], { stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`[${task.name}] failed with exit code ${result.status ?? 1}`)
  }
}

const main = () => {
  console.log('Timkit Goal Smoke Test')
  console.log('======================')

  tasks.forEach((task) => {
    console.log(`Task: ${task.name}`)
    runTask(task)
  })

  console.log('All smoke tasks passed.')
}

main()
