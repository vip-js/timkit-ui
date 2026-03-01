import fs from 'fs'
import path from 'path'

const BUILTIN_ALIASES: Record<string, string> = {
  'number-input': 'stepper',
}

const normalizeName = (name: string) => name.trim().toLowerCase()

const readAliasesFromDisk = (cwd: string): Record<string, string> => {
  const candidates = [
    path.join(cwd, 'registry-aliases.json'),
    path.join(cwd, 'apps/docs/data/registry-aliases.json'),
  ]

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue
    try {
      const data = JSON.parse(fs.readFileSync(candidate, 'utf-8')) as Record<string, string>
      return Object.fromEntries(
        Object.entries(data)
          .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
          .map(([alias, canonical]) => [normalizeName(alias), canonical])
      )
    } catch {
      return {}
    }
  }

  return {}
}

const getAliasMap = (cwd: string): Record<string, string> => {
  return {
    ...BUILTIN_ALIASES,
    ...readAliasesFromDisk(cwd),
  }
}

export const resolveComponentAlias = (name: string, cwd = process.cwd()): string => {
  const aliases = getAliasMap(cwd)
  return aliases[normalizeName(name)] || name
}

export const getAliasesForComponent = (canonicalName: string, cwd = process.cwd()): string[] => {
  const aliases = getAliasMap(cwd)
  return Object.entries(aliases)
    .filter(([, canonical]) => canonical === canonicalName)
    .map(([alias]) => alias)
}
