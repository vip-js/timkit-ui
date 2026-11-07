import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { componentNames } from './component-names'
import { ucsRegistry } from './registry'

const componentsDir = path.resolve(__dirname, '../components')
const configPath = path.resolve(__dirname, '../../tsconfig.json')
const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath))
const program = ts.createProgram(parsed.fileNames, parsed.options)
const checker = program.getTypeChecker()

const propsTypeName = (name: string) =>
  `${name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}Props`

const exportedProps = (name: string) => {
  const filePath = path.join(componentsDir, name, 'props.ts')
  const source = program.getSourceFile(filePath)
  if (!source) return []
  const wanted = propsTypeName(name)
  let alias: ts.TypeAliasDeclaration | undefined
  source.forEachChild((node) => {
    if (!ts.isTypeAliasDeclaration(node)) return
    if (node.name.text.toLowerCase() === wanted.toLowerCase()) alias = node
  })
  if (!alias) return []
  const type = checker.getTypeFromTypeNode(alias.type)
  return checker
    .getPropertiesOfType(type)
    .map((property) => property.getName())
    .filter((property) => property !== '__type')
}

describe('inspect props match TypeScript props', () => {
  it.each(componentNames)('%s schema props are on the exported props type', (name) => {
    const file = path.join(componentsDir, name, 'props.ts')
    expect(fs.existsSync(file), name).toBe(true)
    const fields = exportedProps(name)
    const schema = (ucsRegistry[name]?.props ?? []).map((prop) => prop.name)
    expect(fields.length, `${name} exported props`).toBeGreaterThan(0)
    const missing = schema.filter((prop) => !fields.includes(prop))
    expect(missing, `${name} schema props missing from ${propsTypeName(name)}`).toEqual([])
  })
})
