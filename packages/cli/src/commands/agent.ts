import { TimkitAgent, type BuildMode, type TimkitFramework } from '@timui/agent'
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
  })
