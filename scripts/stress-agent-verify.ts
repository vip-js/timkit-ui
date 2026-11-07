import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { performance } from 'node:perf_hooks'

import { buildAgentContract, TimkitAgent } from '../packages/agent/src/index'
import { componentDocsPath } from '../packages/agent/src/docs-map'
import { reduceAgentThread, type AgentUiAction } from '../packages/core/src/shared/agent-thread'
import type { RegistryItem } from '../packages/core/src/shared/schema'

const ROOT = path.resolve(__dirname, '..')
const INDEX = path.join(ROOT, 'apps/docs/data/registry-index.json')
const DEMO_ROOT = path.join(ROOT, 'apps/docs/registry/default/components')

type Failure = { area: string; detail: string }

const failures: Failure[] = []
const fail = (area: string, detail: string) => failures.push({ area, detail })

const percentile = (samples: number[], p: number) => {
  const sorted = [...samples].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)
  return sorted[Math.max(0, index)]
}

const timeCall = (run: () => void) => {
  const start = performance.now()
  run()
  return performance.now() - start
}

const main = () => {
  const index = JSON.parse(fs.readFileSync(INDEX, 'utf8')) as { items: RegistryItem[] }
  const items = index.items
  const ui = items.filter((item) => item.type === 'registry:ui')
  const agent = new TimkitAgent({
    registryItems: items,
    registryBaseUrl: 'https://ui.timkit.cn',
    defaultFramework: 'react',
  })

  const contractMs: number[] = []
  for (const item of ui) {
    const elapsed = timeCall(() => {
      let contract
      try {
        contract = buildAgentContract(item, { registryBaseUrl: 'https://ui.timkit.cn' })
      } catch (error) {
        fail('agent-contract', `${item.name}: ${error instanceof Error ? error.message : error}`)
        return
      }
      if (!contract.props.length && !contract.parts.length) {
        fail('agent-contract', `${item.name}: no props and no parts`)
      }
      if (!contract.examples.some((example) => example.code.trim().length > 40)) {
        fail('agent-contract', `${item.name}: no usable example`)
      }
      if (!contract.pitfalls.some((itemText) => itemText.includes('className'))) {
        fail('agent-contract', `${item.name}: missing className pitfall`)
      }
      if (!contract.install.includes('timkit add')) fail('agent-contract', `${item.name}: no install command`)
      if (item.name === 'table') {
        const names = new Set(contract.props.map((prop) => prop.name))
        for (const required of ['sortColumn', 'sortDirection', 'selectedIds', 'emptyLabel']) {
          if (!names.has(required)) fail('agent-contract', `table missing ${required}`)
        }
      }
      const demoDir = path.join(DEMO_ROOT, componentDocsPath(item.name))
      if (!fs.existsSync(demoDir)) fail('docs', `${item.name}: missing demo dir ${demoDir}`)
      const demoFiles = walk(demoDir)
      for (const ext of ['.tsx', '.vue', '.html', '.wxml']) {
        if (!demoFiles.some((file) => file.endsWith(ext))) {
          fail('docs', `${item.name}: demo dir missing ${ext}`)
        }
      }
      const generated = agent.generateComponent({ name: item.name, framework: 'react' })
      const source = generated.files[0]?.content || ''
      if (!source.trim()) fail('agent-generate', `${item.name}: empty snippet`)
      const validation = agent.validateComponent(source, {
        framework: 'react',
        component: item.name,
        checkSyntax: true,
      })
      if (!validation.valid) {
        fail(
          'agent-validate',
          `${item.name}: ${validation.issues.map((issue) => issue.message).join('; ')}`
        )
      }
    })
    contractMs.push(elapsed)
  }

  const prompts: Array<{ prompt: string; expect: string | 'none' }> = [
    { prompt: '做一个主按钮', expect: 'button' },
    { prompt: '登录用的输入框', expect: 'input' },
    { prompt: '确认删除的对话框', expect: 'dialog' },
    { prompt: '完全不知所云的量子烤土豆', expect: 'none' },
  ]
  const planMs: number[] = []
  for (const sample of prompts) {
    const elapsed = timeCall(() => {
      const plan = agent.plan({ prompt: sample.prompt, framework: 'react', mode: 'agent' })
      if (sample.expect === 'none') {
        if (plan.confidence !== 'none') fail('agent-plan', `${sample.prompt}: confidence ${plan.confidence}`)
        if (plan.installCommands.length) fail('agent-plan', `${sample.prompt}: installed a fallback`)
      } else if (plan.selected[0]?.name !== sample.expect) {
        fail(
          'agent-plan',
          `${sample.prompt}: expected ${sample.expect} first, got ${plan.selected.map((item) => item.name).join(',')}`
        )
      }
    })
    planMs.push(elapsed)
  }

  for (let i = 0; i < 50; i++) {
    planMs.push(timeCall(() => agent.plan({ prompt: '做一个主按钮', framework: 'react', mode: 'agent' })))
  }

  const threadMs: number[] = []
  const seed = agent.seedThread('refund-support')
  const seeded = agent.validateThread(seed)
  if (!seeded.valid) fail('agent-thread', seeded.summary)
  let thread = seed
  const actions: AgentUiAction[] = [
    { type: 'tool.finish', id: 'refund', status: 'succeeded', output: 'too early' },
    { type: 'approval.decide', id: 'refund-approval', decision: 'approved' },
    { type: 'tool.finish', id: 'refund', status: 'succeeded', output: 'Refund sent.' },
  ]
  for (const action of actions) {
    const next = reduceAgentThread(thread, action)
    if (action.type === 'tool.finish' && action.output === 'too early' && next.accepted) {
      fail('agent-thread', 'tool.finish succeeded before approval')
    }
    if (action.type === 'tool.finish' && action.output === 'Refund sent.' && !next.accepted) {
      fail('agent-thread', `tool.finish after approval rejected: ${next.reason}`)
    }
    if (next.accepted) thread = next.thread
  }
  for (let i = 0; i < 2000; i++) {
    threadMs.push(
      timeCall(() => {
        agent.validateThread(seed)
        agent.suggestThreadNext(seed)
      })
    )
  }

  const formContract = buildAgentContract(
    { name: 'form', type: 'registry:ui', description: 'A form that validates fields and submits their values.' },
    { registryBaseUrl: 'https://ui.timkit.cn' }
  )
  if (!formContract.props.some((prop) => prop.name === 'submitLabel')) {
    fail('agent-contract', 'form contract missing submitLabel')
  }
  for (const framework of ['vue', 'weapp'] as const) {
    for (const name of ['button', 'input', 'dialog']) {
      const generated = agent.generateComponent({ name, framework })
      const validation = agent.validateComponent(generated.files[0]?.content || '', {
        framework,
        component: name,
        checkSyntax: true,
      })
      if (!validation.valid) {
        fail(
          'agent-validate',
          `${framework} ${name}: ${validation.issues.map((issue) => issue.message).join('; ')}`
        )
      }
    }
  }

  const htmlFiles = walk(DEMO_ROOT).filter((file) => file.endsWith('.html'))
  const vueLike = htmlFiles.filter((file) => /^\s*<template/.test(fs.readFileSync(file, 'utf8')))
  if (vueLike.length) fail('html-demo', `${vueLike.length} html files still start with <template>`)

  const cliBin = path.join(ROOT, 'packages/cli/src/index.ts')
  const cliCalls = [
    ['agent', 'plan', '做一个主按钮', '--json'],
    ['agent', 'inspect', 'button', '--json'],
    ['agent', 'thread', 'protocol', '--json'],
  ]
  for (const args of cliCalls) {
    try {
      const stdout = execFileSync('pnpm', ['exec', 'tsx', cliBin, ...args], {
        cwd: ROOT,
        encoding: 'utf8',
        timeout: 60000,
        maxBuffer: 20 * 1024 * 1024,
      })
      const jsonStart = stdout.indexOf('{')
      const json = JSON.parse(jsonStart >= 0 ? stdout.slice(jsonStart) : stdout)
      if (args[1] === 'plan' && json.selected?.[0]?.name !== 'button') {
        fail('cli', `plan did not put button first: ${stdout.slice(0, 240)}`)
      }
      if (args[1] === 'inspect' && json.name !== 'button') fail('cli', 'inspect button returned another name')
      if (args[1] === 'thread' && !json.reducer) fail('cli', 'thread protocol missing reducer')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      fail('cli', `${args.join(' ')}: ${message.slice(0, 400)}`)
    }
  }

  const contractP95 = percentile(contractMs, 95)
  const planP95 = percentile(planMs, 95)
  const threadP95 = percentile(threadMs, 95)
  if (contractP95 > 250) fail('perf', `contract+generate+validate p95 ${contractP95.toFixed(1)}ms > 250ms`)
  if (planP95 > 40) fail('perf', `plan p95 ${planP95.toFixed(1)}ms > 40ms`)
  if (threadP95 > 5) fail('perf', `thread validate+suggest p95 ${threadP95.toFixed(1)}ms > 5ms`)

  console.log('Agent stress verification')
  console.log('=========================')
  console.log(`UI contracts exercised: ${ui.length}`)
  console.log(`contract+validate p95: ${contractP95.toFixed(1)}ms`)
  console.log(`plan p95: ${planP95.toFixed(1)}ms`)
  console.log(`thread validate+suggest p95: ${threadP95.toFixed(1)}ms over ${threadMs.length} calls`)
  console.log(`html demos checked: ${htmlFiles.length}, vue templates: ${vueLike.length}`)
  if (failures.length) {
    failures.slice(0, 40).forEach((item) => console.log(`[FAIL] ${item.area}: ${item.detail}`))
    console.log(`${failures.length} failures`)
    process.exit(1)
  }
  console.log('Agent stress verification passed.')
}

const walk = (dir: string, acc: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, acc)
    else acc.push(full)
  }
  return acc
}

main()
