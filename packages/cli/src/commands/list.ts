import { Command } from 'commander'

import { loadRegistryIndex } from '../lib/registry'

export const list = new Command()
  .name('list')
  .description('List available components and frameworks')
  .option('--tag <tag>', 'filter by tag')
  .option('--framework <framework>', 'filter by framework (react|vue|svelte|html|weapp)')
  .option('--registry <url>', 'registry url override')
  .action(async (opts) => {
    try {
      const items = await loadRegistryIndex(opts.registry)
      const filtered = items.filter((item) => {
        if (opts.tag && !(item.meta?.tags || []).includes(opts.tag)) return false
        if (opts.framework && !(item.meta?.frameworks || []).includes(opts.framework)) return false
        return true
      })
      filtered.forEach((item) => {
        const fws = (item.meta?.frameworks || []).join(', ') || 'n/a'
        console.log(`${item.name} [${item.type}] - frameworks: ${fws}`)
      })
      console.log(`\nTotal: ${filtered.length}`)
    } catch (e) {
      console.error('Failed to load registry', e)
      process.exit(1)
    }
  })
