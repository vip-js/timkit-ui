import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

import { componentDocsPath } from '../packages/agent/src/docs-map'

const ROOT = path.resolve(__dirname, '..')
const DEMO_ROOT = path.join(ROOT, 'apps/docs/registry/default/components')
const OUT = path.join(ROOT, 'apps/docs/.typecheck')

type RegistryIndex = { items: Array<{ name: string; type?: string }> }

const pascal = (name: string) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const pickExample = (dir: string, extension: string, name: string) => {
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(extension))
    .sort()
  if (!files.length) return null
  const aliases = [name, pascal(name), name.replace(/-/g, '')]
  const scored = files.map((file) => {
    const full = path.join(dir, file)
    const source = fs.readFileSync(full, 'utf8')
    const mentions = aliases.some((alias) => source.includes(alias))
    const demo = file.includes('-demo.') || file.endsWith(`-01${extension}`)
    return { full, mentions, demo }
  })
  return (scored.find((file) => file.mentions && file.demo) ?? scored.find((file) => file.mentions) ?? scored[0]).full
}

const index = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'apps/docs/data/registry-index.json'), 'utf8')
) as RegistryIndex
const names = index.items.filter((item) => item.type === 'registry:ui').map((item) => item.name)

const reactFiles: string[] = []
const vueFiles: string[] = []
const missing: string[] = []

for (const name of names) {
  const dir = path.join(DEMO_ROOT, componentDocsPath(name))
  if (!fs.existsSync(dir)) {
    missing.push(`${name}: missing demo dir`)
    continue
  }
  const react = pickExample(dir, '.tsx', name)
  const vue = pickExample(dir, '.vue', name)
  if (!react) missing.push(`${name}: missing tsx example`)
  else reactFiles.push(path.relative(path.join(ROOT, 'apps/docs'), react))
  if (!vue) missing.push(`${name}: missing vue example`)
  else vueFiles.push(path.relative(path.join(ROOT, 'apps/docs'), vue))
}

const markupErrors: string[] = []
for (const name of names) {
  const dir = path.join(DEMO_ROOT, componentDocsPath(name))
  for (const extension of ['.html', '.wxml'] as const) {
    const file = pickExample(dir, extension, name)
    if (!file) {
      markupErrors.push(`${name}: missing ${extension}`)
      continue
    }
    const source = fs.readFileSync(file, 'utf8').trim()
    if (source.length < 20) markupErrors.push(`${path.relative(ROOT, file)}: too short`)
    if (/^<template[\s>]/i.test(source)) markupErrors.push(`${path.relative(ROOT, file)}: starts with template`)
    if (!/^<[a-zA-Z]/.test(source.replace(/<!--[\s\S]*?-->/g, '').trim())) {
      markupErrors.push(`${path.relative(ROOT, file)}: missing a root element`)
    }
  }
}

if (missing.length || markupErrors.length) {
  console.error([...missing, ...markupErrors].join('\n'))
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })

const reactConfig = {
  compilerOptions: {
    target: 'esnext',
    module: 'esnext',
    moduleResolution: 'bundler',
    jsx: 'react-jsx',
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    esModuleInterop: true,
    isolatedModules: true,
    baseUrl: '.',
    paths: {
      '@timui/react': ['../../packages/react/src/index.ts'],
      '@timui/react/*': ['../../packages/react/src/*'],
      '@timui/core': ['../../packages/core/src/index.ts'],
      '@timui/core/*': ['../../packages/core/src/*'],
      '@timui/*': ['../../packages/*/src'],
      '@/*': ['../*'],
    },
  },
  include: reactFiles.map((file) => path.relative(OUT, path.join(ROOT, 'apps/docs', file))),
}

const vueConfig = {
  compilerOptions: {
    target: 'esnext',
    module: 'esnext',
    moduleResolution: 'bundler',
    jsx: 'preserve',
    jsxImportSource: 'vue',
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    esModuleInterop: true,
    isolatedModules: true,
    baseUrl: '.',
    paths: {
      vue: [createRequire(path.join(ROOT, 'packages/vue/package.json')).resolve('vue').replace(/index\.[cm]?js$/, 'dist/vue.d.ts')],
      '@timui/vue': [path.join(ROOT, 'packages/vue/src/index.ts')],
      '@timui/vue/*': [path.join(ROOT, 'packages/vue/src/*')],
      '@timui/core': [path.join(ROOT, 'packages/core/src/index.ts')],
      '@timui/core/*': [path.join(ROOT, 'packages/core/src/*')],
      '@/*': [path.join(ROOT, 'apps/docs/*')],
    },
  },
  include: [
    '../../packages/vue/env.d.ts',
    ...vueFiles.map((file) => path.relative(OUT, path.join(ROOT, 'apps/docs', file))),
  ],
}

fs.writeFileSync(path.join(OUT, 'react.json'), JSON.stringify(reactConfig, null, 2))
fs.writeFileSync(path.join(OUT, 'vue.json'), JSON.stringify(vueConfig, null, 2))

const run = (command: string, args: string[]) => {
  try {
    execFileSync(command, args, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' })
    return ''
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout ?? ''
    const stderr = (error as { stderr?: string }).stderr ?? ''
    return `${stdout}\n${stderr}`
  }
}

console.log(`Typechecking ${reactFiles.length} React examples and ${vueFiles.length} Vue examples`)
const reactErrors = run('pnpm', ['exec', 'tsc', '--noEmit', '-p', 'apps/docs/.typecheck/react.json', '--pretty', 'false'])
const vueErrors = run(path.join(ROOT, 'packages/vue/node_modules/.bin/vue-tsc'), [
  '--noEmit',
  '-p',
  path.join(ROOT, 'apps/docs/.typecheck/vue.json'),
  '--pretty',
  'false',
])

const summarize = (label: string, output: string) => {
  const lines = output.split('\n').filter((line) => line.includes('error TS'))
  console.log(`\n${label}: ${lines.length} errors`)
  const byFile = new Map<string, number>()
  for (const line of lines) {
    const file = line.split('(')[0]
    byFile.set(file, (byFile.get(file) ?? 0) + 1)
  }
  for (const [file, count] of [...byFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`  ${count}\t${file}`)
  }
  if (lines.length) console.log(lines.slice(0, 30).join('\n'))
  return lines.length
}

const reactCount = summarize('react', reactErrors)
const vueCount = summarize('vue', vueErrors)
if (reactCount || vueCount) process.exit(1)

const ts = createRequire(import.meta.url)('typescript') as typeof import('typescript')
const docsConfigPath = path.join(ROOT, 'apps/docs/tsconfig.json')
const docsSource = fs.readFileSync(docsConfigPath, 'utf8')
const nextConfig = fs.readFileSync(path.join(ROOT, 'apps/docs/next.config.ts'), 'utf8')
if (!docsSource.includes('../../packages/react/src/index.ts') || !docsSource.includes('../../packages/react/src/*')) {
  console.error('docs tsconfig does not point @timui/react at packages/react/src')
  process.exit(1)
}
if (!nextConfig.includes("path.join(__dirname, '../../packages/react/src')")) {
  console.error('docs next config does not alias @timui/react to packages/react/src')
  process.exit(1)
}
const read = ts.readConfigFile(docsConfigPath, ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(docsConfigPath))
const host = ts.createCompilerHost(parsed.options)
const fromExample = path.join(ROOT, 'apps/docs', reactFiles[0] ?? '')
for (const spec of ['@timui/react', '@timui/react/agent']) {
  const resolved = ts.resolveModuleName(spec, fromExample, parsed.options, host)
  const fileName = resolved.resolvedModule?.resolvedFileName ?? ''
  const expected = spec === '@timui/react' ? 'packages/react/src/index.ts' : 'packages/react/src/agent/index.ts'
  if (!fileName.endsWith(expected)) {
    console.error(`${spec} resolved to ${fileName || 'nothing'}, expected ${expected}`)
    process.exit(1)
  }
}
console.log('\nRegistry example typecheck passed.')
