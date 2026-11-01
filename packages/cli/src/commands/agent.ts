import fs from 'fs'
import path from 'path'
import { buildAgentContract, TimkitAgent, type BuildMode, type TimkitFramework } from '@timui/agent'
import { Command } from 'commander'

import { loadRegistryIndex } from '../lib/registry'

const parseFramework = (value?: string): TimkitFramework | undefined => {
  if (!value) return undefined
  if (['react', 'vue', 'html', 'weapp'].includes(value)) return value as TimkitFramework
  throw new Error(`Unsupported framework: ${value}`)
}

const parseMode = (value?: string): BuildMode | undefined => {
  if (!value) return undefined
  if (['chat', 'cli', 'agent'].includes(value)) return value as BuildMode
  throw new Error(`Unsupported mode: ${value}`)
}

const printJson = (payload: object | string | number | boolean | null | undefined) => {
  console.log(JSON.stringify(payload, null, 2))
}

export const agent = new Command()
  .name('agent')
  .description('Agent-native planning, discovery, generation, and validation')

agent
  .command('plan')
  .argument('<prompt>', 'natural language app or UI request')
  .option('--framework <framework>', 'target framework (react|vue|html|weapp)', 'react')
  .option('--mode <mode>', 'interaction mode (chat|cli|agent)', 'agent')
  .option('--mobile', 'prefer mobile-ready registry items')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Create an install-and-verify plan from a natural language request')
  .action(async (prompt, opts) => {
    const items = await loadRegistryIndex(opts.registry)
    const agentSdk = new TimkitAgent({
      registryItems: items,
      registryBaseUrl: opts.registry,
      defaultFramework: parseFramework(opts.framework),
    })
    const plan = agentSdk.plan({
      prompt,
      framework: parseFramework(opts.framework),
      mode: parseMode(opts.mode),
      mobile: Boolean(opts.mobile),
    })

    if (opts.json) {
      printJson(plan)
      return
    }

    console.log(`Framework: ${plan.framework}`)
    console.log(`Mode: ${plan.mode}`)
    console.log(`Confidence: ${plan.confidence}`)
    if (plan.clarification) console.log(`\n${plan.clarification}`)
    console.log('\nSelected registry items:')
    plan.selected.forEach((item) => {
      console.log(`- ${item.name} [${item.type}] ${item.url}`)
    })
    console.log('\nInstall commands:')
    plan.installCommands.forEach((command) => console.log(command))
    console.log('\nVerify:')
    plan.verificationCommands.forEach((command) => console.log(command))
  })

agent
  .command('inspect')
  .argument('[name]', 'component, block, or template name')
  .option('--framework <framework>', 'filter by framework (react|vue|html|weapp)')
  .option('--mobile', 'show mobile-ready items')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Inspect Agent-ready registry metadata')
  .action(async (name, opts) => {
    const items = await loadRegistryIndex(opts.registry)
    const agentSdk = new TimkitAgent({
      registryItems: items,
      registryBaseUrl: opts.registry,
      defaultFramework: parseFramework(opts.framework) || 'react',
    })
    const payload = name
      ? agentSdk.getComponentMetadata(name)
      : agentSdk.listComponents({
          framework: parseFramework(opts.framework),
          mobile: Boolean(opts.mobile),
        })

    if (opts.json) {
      printJson(payload)
      return
    }

    if (!payload) {
      console.error(`No registry metadata found for ${name}`)
      process.exit(1)
    }

    const rows = Array.isArray(payload) ? payload : [payload]
    rows.forEach((item) => {
      console.log(`${item.name} [${item.type}]`)
      console.log(`  ${item.description}`)
      console.log(`  frameworks: ${item.frameworks.join(', ') || 'n/a'}`)
      console.log(`  url: ${item.url}`)
    })
  })

agent
  .command('generate')
  .argument('<name>', 'component name')
  .option('--framework <framework>', 'target framework (react|vue|html|weapp)', 'react')
  .option('--export <name>', 'export/component name')
  .option('--scenario <text>', 'placeholder scenario text')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Generate a small composable example for an Agent-selected component')
  .action(async (name, opts) => {
    const items = await loadRegistryIndex(opts.registry)
    const agentSdk = new TimkitAgent({
      registryItems: items,
      registryBaseUrl: opts.registry,
      defaultFramework: parseFramework(opts.framework),
    })
    const generated = agentSdk.generateComponent({
      name,
      framework: parseFramework(opts.framework),
      exportName: opts.export,
      scenario: opts.scenario,
    })

    if (opts.json) {
      printJson(generated)
      return
    }

    generated.files.forEach((file) => {
      console.log(`// ${file.path}`)
      console.log(file.content)
    })
    console.log(`Install: ${generated.installCommand}`)
    generated.notes.forEach((note) => console.log(`Note: ${note}`))
  })

const readPackageDeps = (cwd: string) => {
  const packagePath = path.join(cwd, 'package.json')
  if (!fs.existsSync(packagePath)) return {}
  const parsed: {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  } = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  return {
    dependencies: parsed.dependencies,
    devDependencies: parsed.devDependencies,
  }
}

const collectSources = (cwd: string) => {
  const roots = ['src', 'app', 'pages', 'components']
    .map((dir) => path.join(cwd, dir))
    .filter((dir) => fs.existsSync(dir))
  const files: string[] = []

  const walk = (dir: string) => {
    if (files.length >= 200) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!/\.(tsx?|vue|jsx?|html|wxml)$/.test(entry.name)) continue
      if (fs.statSync(full).size > 200_000) continue
      files.push(fs.readFileSync(full, 'utf8'))
    }
  }

  roots.forEach(walk)
  return files
}

agent
  .command('validate')
  .argument('<file>', 'source file to validate')
  .option('--framework <framework>', 'target framework (react|vue|html|weapp)', 'react')
  .option('--component <name>', 'component schema to check against')
  .option('--fix', 'rewrite safe convention issues in the file')
  .option('--json', 'print machine-readable JSON')
  .description('Validate an agent-written snippet against Timkit conventions')
  .action(async (file, opts) => {
    const sourcePath = path.resolve(file)
    if (!fs.existsSync(sourcePath)) {
      console.error(`File not found: ${sourcePath}`)
      process.exit(1)
    }
    const agentSdk = new TimkitAgent({
      defaultFramework: parseFramework(opts.framework),
    })
    const source = fs.readFileSync(sourcePath, 'utf8')
    const framework = parseFramework(opts.framework)
    const fixed = opts.fix
      ? agentSdk.fixComponent(source, { framework, component: opts.component })
      : undefined
    if (fixed && fixed.changed) fs.writeFileSync(sourcePath, fixed.code)
    const result = fixed
      ? fixed.validation
      : agentSdk.validateComponent(source, {
          framework,
          component: opts.component,
        })

    if (opts.json) {
      printJson(fixed ? { ...fixed, path: sourcePath } : result)
    } else {
      if (fixed?.changes.length) {
        console.log('Applied:')
        fixed.changes.forEach((change) => console.log(`- ${change}`))
      }
      console.log(result.valid ? 'Valid' : 'Invalid')
      result.issues.forEach((issue) => {
        const line = issue.line ? `:${issue.line}` : ''
        console.log(`- [${issue.type}]${line} ${issue.message}`)
        if (issue.fix) console.log(`  fix: ${issue.fix}`)
      })
      result.suggestions.forEach((suggestion) => console.log(`- suggestion: ${suggestion}`))
    }

    if (!result.valid) process.exit(1)
  })

agent
  .command('deps')
  .argument('<name>', 'component name')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Show direct, transitive, and reverse registry dependencies')
  .action(async (name, opts) => {
    const items = await loadRegistryIndex(opts.registry)
    const agentSdk = new TimkitAgent({
      registryItems: items,
      registryBaseUrl: opts.registry,
    })
    const check = agentSdk.checkDependencies(name)

    if (opts.json) {
      printJson(check)
      return
    }

    console.log(`${check.name}`)
    console.log(`Direct: ${check.direct.join(', ') || '(none)'}`)
    console.log(`Transitive: ${check.transitive.join(', ') || '(none)'}`)
    console.log(`Missing: ${check.missing.join(', ') || '(none)'}`)
    console.log(`Dependents: ${check.dependents.join(', ') || '(none)'}`)
  })

agent
  .command('recipe')
  .argument('[id]', 'recipe id, such as login-form')
  .option('--framework <framework>', 'target framework (react|vue)', 'react')
  .option('--json', 'print machine-readable JSON')
  .description('List or print a validated multi-component recipe')
  .action(async (id, opts) => {
    const agentSdk = new TimkitAgent({
      defaultFramework: parseFramework(opts.framework) || 'react',
    })
    const payload = id
      ? agentSdk.generateRecipe(id, parseFramework(opts.framework))
      : agentSdk.listRecipes()

    if (opts.json) {
      printJson(payload)
      return
    }

    if (Array.isArray(payload)) {
      payload.forEach((recipe) => {
        console.log(`${recipe.id} [${recipe.frameworks.join(', ')}]`)
        console.log(`  ${recipe.description}`)
      })
      return
    }

    if (!payload.files.length) {
      payload.notes.forEach((note) => console.error(note))
      process.exit(1)
    }
    payload.files.forEach((file) => {
      console.log(`// ${file.path}`)
      console.log(file.content)
    })
    console.log(`Install: ${payload.installCommand}`)
  })

agent
  .command('ui')
  .option('--json', 'print machine-readable JSON')
  .description('List agent business components and how to import them')
  .action((opts) => {
    const agentSdk = new TimkitAgent()
    const catalog = agentSdk.listAgentUi()
    if (opts.json) {
      printJson(catalog)
      return
    }
    catalog.forEach((component) => {
      console.log(`${component.name} from ${component.importFrom}`)
      console.log(`  ${component.summary}`)
    })
  })

agent
  .command('guide')
  .argument('<name>', 'component, block, or template name')
  .option('--framework <framework>', 'example framework (react|vue|html|weapp)', 'react')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Print the agent contract for one registry item')
  .action(async (name, opts) => {
    const items = await loadRegistryIndex(opts.registry)
    const item = items.find((entry) => entry.name === name)
    if (!item) {
      console.error(`No registry item found for ${name}`)
      process.exit(1)
    }
    const contract = buildAgentContract(item, {
      registryBaseUrl: opts.registry,
      framework: parseFramework(opts.framework),
    })

    if (opts.json) {
      printJson(contract)
      return
    }

    console.log(`${contract.name} [${contract.sourceKind}]`)
    console.log(contract.install)
    contract.rules.forEach((rule) => console.log(`- ${rule}`))
  })

agent
  .command('context')
  .option('-c, --cwd <cwd>', 'project directory', process.cwd())
  .option('--framework <framework>', 'target framework (react|vue|html|weapp)')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .description('Show framework, installed Timkit components, and warnings for the current project')
  .action(async (opts) => {
    const cwd = path.resolve(opts.cwd)
    const items = await loadRegistryIndex(opts.registry)
    const deps = readPackageDeps(cwd)
    const agentSdk = new TimkitAgent({
      registryItems: items,
      registryBaseUrl: opts.registry,
      defaultFramework: parseFramework(opts.framework) || 'react',
    })
    const context = agentSdk.getProjectContext({
      ...deps,
      files: collectSources(cwd),
    })

    if (opts.json) {
      printJson(context)
      return
    }

    console.log(`Framework: ${context.framework}`)
    console.log(`Registry: ${context.registryBaseUrl}`)
    console.log(`Installed: ${context.installedComponents.join(', ') || '(none detected)'}`)
    context.warnings.forEach((warning) => console.log(`Warning: ${warning}`))
  })
