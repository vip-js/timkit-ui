import { Command } from 'commander'

import type { JsonValue } from '@timui/core'
import { getAliasesForComponent } from '../lib/component-aliases'
import { loadRegistryIndex } from '../lib/registry'

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export const list = new Command()
  .name('list')
  .description('List available components and frameworks')
  .option('--tag <tag>', 'filter by tag')
  .option('--framework <framework>', 'filter by framework (react|vue|html|weapp)')
  .option('--registry <url>', 'registry url override')
  .action(async (opts) => {
    try {
      const items = await loadRegistryIndex(opts.registry)
      const filtered = items.filter((item) => {
        const tags = getStringArray(item.meta?.tags)
        const frameworks = getStringArray(item.meta?.frameworks)
        if (opts.tag && !tags.includes(opts.tag)) return false
        if (opts.framework && !frameworks.includes(opts.framework)) return false
        return true
      })
      filtered.forEach((item) => {
        const fws = getStringArray(item.meta?.frameworks).join(', ') || 'n/a'
        const aliasesFromMeta = getStringArray(item.meta?.aliases)
        const aliasesFromConfig = getAliasesForComponent(item.name)
        const aliases = Array.from(new Set([...aliasesFromMeta, ...aliasesFromConfig]))
        const aliasLabel = aliases.length ? ` - aliases: ${aliases.join(', ')}` : ''
        console.log(`${item.name} [${item.type}] - frameworks: ${fws}${aliasLabel}`)
      })
      console.log(`\nTotal: ${filtered.length}`)
    } catch (e) {
      console.error('Failed to load registry', e)
      process.exit(1)
    }
  })
