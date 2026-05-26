import type { JsonValue } from '@timui/core'
import { Command } from 'commander'

import { getAliasesForComponent } from '../lib/component-aliases'
import { loadRegistryIndex } from '../lib/registry'

const getStringArray = (value: JsonValue | undefined): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export const list = new Command()
  .name('list')
  .description('List available components, blocks, templates, and frameworks')
  .option('--tag <tag>', 'filter by tag')
  .option('--type <type>', 'filter by registry type (registry:ui|registry:block|registry:page)')
  .option('--category <category>', 'filter by category')
  .option('--mobile', 'show only mobile-ready items')
  .option('--framework <framework>', 'filter by framework (react|vue|html|weapp)')
  .option('--registry <url>', 'registry url override')
  .option('--json', 'print machine-readable JSON')
  .action(async (opts) => {
    try {
      const items = await loadRegistryIndex(opts.registry)
      const filtered = items.filter((item) => {
        const tags = getStringArray(item.meta?.tags)
        const frameworks = getStringArray(item.meta?.frameworks)
        const category = typeof item.meta?.category === 'string' ? item.meta.category : undefined
        if (opts.tag && !tags.includes(opts.tag)) return false
        if (opts.type && item.type !== opts.type) return false
        if (
          opts.category &&
          category !== opts.category &&
          !item.categories?.includes(opts.category)
        )
          return false
        if (opts.mobile) {
          const viewport = typeof item.meta?.viewport === 'string' ? item.meta.viewport : ''
          if (!tags.includes('mobile') && !viewport.includes('mobile')) return false
        }
        if (opts.framework && !frameworks.includes(opts.framework)) return false
        return true
      })
      if (opts.json) {
        console.log(JSON.stringify(filtered, null, 2))
        return
      }
      filtered.forEach((item) => {
        const fws = getStringArray(item.meta?.frameworks).join(', ') || 'n/a'
        const aliasesFromMeta = getStringArray(item.meta?.aliases)
        const aliasesFromConfig = getAliasesForComponent(item.name)
        const aliases = Array.from(new Set([...aliasesFromMeta, ...aliasesFromConfig]))
        const aliasLabel = aliases.length ? ` - aliases: ${aliases.join(', ')}` : ''
        const category =
          typeof item.meta?.category === 'string' ? ` - category: ${item.meta.category}` : ''
        console.log(`${item.name} [${item.type}] - frameworks: ${fws}${category}${aliasLabel}`)
      })
      console.log(`\nTotal: ${filtered.length}`)
    } catch (e) {
      console.error('Failed to load registry', e)
      process.exit(1)
    }
  })
