import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '..')
const AGENT_DIST = path.join(ROOT, 'packages/agent/dist/index.mjs')
const AGENT_RECIPES_CHUNK = path.join(ROOT, 'packages/agent/dist/recipes-templates.mjs')
const AGENT_THREAD_COACH_CHUNK = path.join(ROOT, 'packages/agent/dist/thread-coach.mjs')
const REACT_AGENT_DIR = path.join(ROOT, 'packages/react/src/agent')
const CORE_AGENT_THREAD = path.join(ROOT, 'packages/core/src/shared/agent-thread.ts')

const budgets = {
  agentBundleMaxBytes: 52000,
  agentRecipesChunkMaxBytes: 7500,
  agentThreadCoachChunkMaxBytes: 9000,
  reactAgentSourceMaxBytes: 28000,
  coreThreadMaxBytes: 12000,
  reactAgentFileMaxBytes: 4500,
}

const listFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    if (/\.(tsx?|mjs|js)$/.test(entry.name)) return [full]
    return []
  })
}

const size = (file: string) => (fs.existsSync(file) ? fs.statSync(file).size : 0)

const main = () => {
  const findings: string[] = []

  const agentBundle = size(AGENT_DIST)
  if (agentBundle > budgets.agentBundleMaxBytes) {
    findings.push(
      `Agent bundle ${agentBundle}B exceeds ${budgets.agentBundleMaxBytes}B. Split optional validators or lazy-load TypeScript.`
    )
  }

  const recipesChunk = size(AGENT_RECIPES_CHUNK)
  if (recipesChunk > budgets.agentRecipesChunkMaxBytes) {
    findings.push(
      `Agent recipes chunk ${recipesChunk}B exceeds ${budgets.agentRecipesChunkMaxBytes}B. Move templates to static JSON or trim examples.`
    )
  }

  const threadCoachChunk = size(AGENT_THREAD_COACH_CHUNK)
  if (threadCoachChunk > budgets.agentThreadCoachChunkMaxBytes) {
    findings.push(
      `Agent thread-coach chunk ${threadCoachChunk}B exceeds ${budgets.agentThreadCoachChunkMaxBytes}B.`
    )
  }

  const coreThread = size(CORE_AGENT_THREAD)
  if (coreThread > budgets.coreThreadMaxBytes) {
    findings.push(`agent-thread.ts ${coreThread}B exceeds ${budgets.coreThreadMaxBytes}B.`)
  }

  const reactFiles = listFiles(REACT_AGENT_DIR)
  const reactTotal = reactFiles.reduce((sum, file) => sum + size(file), 0)
  if (reactTotal > budgets.reactAgentSourceMaxBytes) {
    findings.push(`React agent source ${reactTotal}B exceeds ${budgets.reactAgentSourceMaxBytes}B.`)
  }

  reactFiles.forEach((file) => {
    const bytes = size(file)
    if (bytes > budgets.reactAgentFileMaxBytes) {
      findings.push(
        `${path.relative(ROOT, file)} ${bytes}B exceeds per-file ${budgets.reactAgentFileMaxBytes}B.`
      )
    }
  })

  console.log('Timkit Agent Performance Report')
  console.log('===============================')
  console.log(`@timui/agent dist: ${agentBundle}B (<= ${budgets.agentBundleMaxBytes}B)`)
  console.log(
    `@timui/agent recipes chunk: ${recipesChunk}B (<= ${budgets.agentRecipesChunkMaxBytes}B)`
  )
  console.log(
    `@timui/agent thread-coach chunk: ${threadCoachChunk}B (<= ${budgets.agentThreadCoachChunkMaxBytes}B)`
  )
  console.log(`@timui/core agent-thread: ${coreThread}B (<= ${budgets.coreThreadMaxBytes}B)`)
  console.log(`@timui/react/agent source: ${reactTotal}B (<= ${budgets.reactAgentSourceMaxBytes}B)`)
  console.log(`Files checked: ${reactFiles.length}`)
  if (findings.length) {
    findings.forEach((item) => console.log(`[MAJOR] ${item}`))
    process.exit(1)
  }
  console.log('Agent performance budgets passed.')
}

main()
