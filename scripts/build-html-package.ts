import fs from 'fs'
import path from 'path'
import ts from 'typescript'

import { htmlAdapterTemplateNames } from '../packages/html/src/capabilities'
import {
  HTML_RUNTIME_AUTO_ATTRIBUTE,
  HTML_RUNTIME_AUTO_VALUE,
  HTML_RUNTIME_ROOT_ATTRIBUTE,
} from '../packages/html/src/runtime-metadata'

const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'packages/html/src')
const DIST_DIR = path.join(ROOT, 'packages/html/dist')
const RUNTIME_DIR = path.join(DIST_DIR, 'runtime')

async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function copyComponents() {
  const srcComponents = path.join(SRC_DIR, 'components')
  const distComponents = path.join(DIST_DIR, 'components')

  if (!fs.existsSync(srcComponents)) return

  await ensureDir(distComponents)

  const items = fs.readdirSync(srcComponents)
  await Promise.all(
    items.map((item) =>
      fs.promises.copyFile(path.join(srcComponents, item), path.join(distComponents, item))
    )
  )
}

function transpileSource(sourceText: string, fileName: string, moduleKind: ts.ModuleKind) {
  return ts.transpileModule(sourceText, {
    fileName,
    compilerOptions: {
      allowJs: true,
      target: ts.ScriptTarget.ES2020,
      module: moduleKind,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      esModuleInterop: true,
    },
  }).outputText
}

async function writeTranspiledModule(
  sourcePath: string,
  cjsOutputPath: string,
  esmOutputPath: string,
  options: {
    esmPostProcess?: (code: string) => string
  } = {}
) {
  const sourceText = await fs.promises.readFile(sourcePath, 'utf-8')
  const cjsCode = transpileSource(sourceText, sourcePath, ts.ModuleKind.CommonJS)
  const esmCode = transpileSource(sourceText, sourcePath, ts.ModuleKind.ES2020)
  await ensureDir(path.dirname(cjsOutputPath))
  await ensureDir(path.dirname(esmOutputPath))
  await fs.promises.writeFile(cjsOutputPath, cjsCode, 'utf-8')
  await fs.promises.writeFile(
    esmOutputPath,
    options.esmPostProcess ? options.esmPostProcess(esmCode) : esmCode,
    'utf-8'
  )
}

function rewriteIndexImports(code: string, format: 'cjs' | 'esm') {
  const ext = format === 'esm' ? 'mjs' : 'js'
  const rewrittenCoreImports = code
    .replace(/from "\.\/capabilities"/g, `from "./capabilities.${ext}"`)
    .replace(/from '\.\/capabilities'/g, `from './capabilities.${ext}'`)
    .replace(/from "\.\/runtime-metadata"/g, `from "./runtime-metadata.${ext}"`)
    .replace(/from '\.\/runtime-metadata'/g, `from './runtime-metadata.${ext}'`)
    .replace(/from "\.\/runtime-protocol"/g, `from "./runtime-protocol.${ext}"`)
    .replace(/from '\.\/runtime-protocol'/g, `from './runtime-protocol.${ext}'`)
    .replace(/require\("\.\/capabilities"\)/g, `require("./capabilities.${ext}")`)
    .replace(/require\("\.\/runtime-metadata"\)/g, `require("./runtime-metadata.${ext}")`)
    .replace(/require\("\.\/runtime-protocol"\)/g, `require("./runtime-protocol.${ext}")`)

  return htmlAdapterTemplateNames.reduce((current, name) => {
    const sourceImport = `./components/${name}.adapter`
    const runtimeImport = `./runtime/${name}.adapter.${ext}`
    return current
      .replace(new RegExp(`from "${sourceImport}"`, 'g'), `from "${runtimeImport}"`)
      .replace(new RegExp(`from '${sourceImport}'`, 'g'), `from '${runtimeImport}'`)
      .replace(new RegExp(`require\\("${sourceImport}"\\)`, 'g'), `require("${runtimeImport}")`)
  }, rewrittenCoreImports)
}

async function writeRuntimeEntry() {
  const runtimeProtocolPath = path.join(SRC_DIR, 'runtime-protocol.ts')
  const runtimeMetadataPath = path.join(SRC_DIR, 'runtime-metadata.ts')
  const runtimeIndexPath = path.join(SRC_DIR, 'index.ts')
  const manifestPath = path.join(SRC_DIR, 'manifest.ts')

  await writeTranspiledModule(
    runtimeProtocolPath,
    path.join(DIST_DIR, 'runtime-protocol.js'),
    path.join(DIST_DIR, 'runtime-protocol.mjs')
  )
  await writeTranspiledModule(
    runtimeMetadataPath,
    path.join(DIST_DIR, 'runtime-metadata.js'),
    path.join(DIST_DIR, 'runtime-metadata.mjs'),
    {
      esmPostProcess: (code) =>
        code
          .replace(/from '\.\/capabilities'/g, "from './capabilities.mjs'")
          .replace(/from "\.\/capabilities"/g, 'from "./capabilities.mjs"'),
    }
  )
  await writeTranspiledModule(
    path.join(SRC_DIR, 'capabilities.ts'),
    path.join(DIST_DIR, 'capabilities.js'),
    path.join(DIST_DIR, 'capabilities.mjs')
  )
  await writeTranspiledModule(
    manifestPath,
    path.join(DIST_DIR, 'manifest.js'),
    path.join(DIST_DIR, 'manifest.mjs')
  )

  await ensureDir(RUNTIME_DIR)
  await Promise.all(
    htmlAdapterTemplateNames.map((name) =>
      writeTranspiledModule(
        path.join(SRC_DIR, 'components', `${name}.adapter.js`),
        path.join(RUNTIME_DIR, `${name}.adapter.js`),
        path.join(RUNTIME_DIR, `${name}.adapter.mjs`)
      )
    )
  )

  await writeTranspiledModule(
    runtimeIndexPath,
    path.join(DIST_DIR, 'index.js'),
    path.join(DIST_DIR, 'index.mjs'),
    {
      esmPostProcess: (code) => rewriteIndexImports(code, 'esm'),
    }
  )
  const cjsIndexPath = path.join(DIST_DIR, 'index.js')
  await fs.promises.writeFile(
    cjsIndexPath,
    rewriteIndexImports(await fs.promises.readFile(cjsIndexPath, 'utf-8'), 'cjs'),
    'utf-8'
  )

  const adapterComponentUnion = htmlAdapterTemplateNames.map((name) => `'${name}'`).join(' | ')
  const dts = `export type HtmlRuntimeComponentName = ${adapterComponentUnion}
export type HtmlCapabilityLevel = 'template-only' | 'template+adapter'
export type HtmlRuntimeCapability = {
  name: HtmlRuntimeComponentName
  level: HtmlCapabilityLevel
  selector: string
  initializer: string
}
export type HtmlRuntimeInitOptions = {
  components?: HtmlRuntimeComponentName[]
}
export type HtmlRuntimeAutoInitOptions = HtmlRuntimeInitOptions & {
  document?: Document
  root?: ParentNode
  selector?: string
  immediate?: boolean
}
export declare const HTML_RUNTIME_ROOT_ATTRIBUTE: '${HTML_RUNTIME_ROOT_ATTRIBUTE}'
export declare const HTML_RUNTIME_AUTO_ATTRIBUTE: '${HTML_RUNTIME_AUTO_ATTRIBUTE}'
export declare const HTML_RUNTIME_AUTO_VALUE: '${HTML_RUNTIME_AUTO_VALUE}'
export declare const htmlRuntimeCapabilities: HtmlRuntimeCapability[]
export declare const htmlRuntimeComponentNames: HtmlRuntimeComponentName[]
export declare function initHtmlComponent(name: HtmlRuntimeComponentName, root?: ParentNode | null): boolean
export declare function initHtmlRuntime(
  root?: ParentNode | null,
  options?: HtmlRuntimeInitOptions
): {
  root: ParentNode | null
  initialized: HtmlRuntimeComponentName[]
  skipped: HtmlRuntimeComponentName[]
}
export declare function autoInitHtmlRuntime(options?: HtmlRuntimeAutoInitOptions): () => void
declare const htmlRuntime: {
  capabilities: HtmlRuntimeCapability[]
  componentNames: HtmlRuntimeComponentName[]
  protocol: {
    rootAttribute: string
    autoAttribute: string
    autoValue: string
  }
  initHtmlComponent: typeof initHtmlComponent
  initHtmlRuntime: typeof initHtmlRuntime
  autoInitHtmlRuntime: typeof autoInitHtmlRuntime
}
export default htmlRuntime
`
  await fs.promises.writeFile(path.join(DIST_DIR, 'index.d.ts'), dts, 'utf-8')

  const manifestDts = `import type { ComponentName, FrameworkManifest } from '@timui/core'

export declare const extraComponents: readonly []
export declare const hookNames: readonly []
export declare const manifest: FrameworkManifest
export declare const framework: FrameworkManifest['framework']
export declare const components: FrameworkManifest['components']
export declare const parts: FrameworkManifest['parts']
export declare const extras: typeof extraComponents
export type FrameworkComponentName = ComponentName
export type FrameworkHookName = (typeof hookNames)[number]
`
  await fs.promises.writeFile(path.join(DIST_DIR, 'manifest.d.ts'), manifestDts, 'utf-8')
}

async function main() {
  await fs.promises.rm(DIST_DIR, { recursive: true, force: true })
  await ensureDir(DIST_DIR)
  await copyComponents()
  await writeRuntimeEntry()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
