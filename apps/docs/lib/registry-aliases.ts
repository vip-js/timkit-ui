import registryAliases from '@/data/registry-aliases.json'

const ALIAS_MAP = Object.fromEntries(
  Object.entries(registryAliases).map(([alias, canonical]) => [alias.toLowerCase(), canonical])
) as Record<string, string>

export const resolveRegistryAlias = (name: string): string => {
  const key = name.trim().toLowerCase()
  return ALIAS_MAP[key] || name
}

export const getRegistryAliasesFor = (canonicalName: string): string[] => {
  return Object.entries(ALIAS_MAP)
    .filter(([, canonical]) => canonical === canonicalName)
    .map(([alias]) => alias)
}
