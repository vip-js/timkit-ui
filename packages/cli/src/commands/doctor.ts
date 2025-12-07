import fs from 'fs'
import path from 'path'
import { Command } from 'commander'

import { detectTailwindVersion, findPackageJson } from '../lib/utils'

function readJSON(file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return null
  }
}

export const doctor = new Command()
  .name('doctor')
  .description('Check project for common setup issues')
  .option('-c, --cwd <cwd>', 'working directory', process.cwd())
  .action((opts) => {
    const cwd = path.resolve(opts.cwd)
    const issues: string[] = []
    const infos: string[] = []

    // package.json deps
    const pkgPath = path.join(cwd, 'package.json')
    const pkg = readJSON(pkgPath)
    if (!pkg) {
      issues.push('package.json not found or invalid.')
    } else {
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
      if (!deps['@timui/tokens'] || !deps['@timui/shared']) {
        issues.push('Missing @timui/tokens or @timui/shared. Run timkit init.')
      } else {
        // Tailwind v4+ tokens preset 仅需要 peer; 检查版本一致性
        const tokenVersion = deps['@timui/tokens']
        const sharedVersion = deps['@timui/shared']
        if (tokenVersion && sharedVersion && tokenVersion !== sharedVersion) {
          infos.push(
            `@timui/tokens (${tokenVersion}) and @timui/shared (${sharedVersion}) versions differ.`
          )
        }
      }
      if (deps.react && deps['react-dom'] && deps.react !== deps['react-dom']) {
        issues.push(`react (${deps.react}) and react-dom (${deps['react-dom']}) versions differ.`)
      }
      // naive duplicate react check: react appears in both deps and devDeps with different versions
      if (
        pkg.dependencies?.react &&
        pkg.devDependencies?.react &&
        pkg.dependencies.react !== pkg.devDependencies.react
      ) {
        issues.push('react version differs between dependencies and devDependencies.')
      }
    }

    // tailwind config
    const twConfig = ['tailwind.config.ts', 'tailwind.config.js'].find((f) =>
      fs.existsSync(path.join(cwd, f))
    )
    const twVersion = detectTailwindVersion(cwd)
    if (!twConfig) {
      issues.push('tailwind.config not found. Run timkit init.')
    } else {
      const content = fs.readFileSync(path.join(cwd, twConfig), 'utf-8')
      if (!content.includes('timkitTailwindPreset')) {
        issues.push('tailwind.config missing timkitTailwindPreset.')
      }
      if (twVersion && twVersion < 4 && !content.includes('content:')) {
        issues.push('Tailwind v3 detected but no content globs configured.')
      }
    }

    // globals css import
    const cssCandidates = [
      'app/globals.css',
      'src/app/globals.css',
      'styles/globals.css',
      'src/index.css',
    ]
    const cssPath = cssCandidates.find((f) => fs.existsSync(path.join(cwd, f)))
    if (cssPath) {
      const css = fs.readFileSync(path.join(cwd, cssPath), 'utf-8')
      if (!css.includes('@timui/tokens')) {
        issues.push(`${cssPath} missing @timui/tokens import.`)
      }
    } else {
      issues.push('globals css not found (app/globals.css or similar).')
    }

    // registry cache presence
    const registryAllPath = path.join(cwd, 'registry-all.json')
    if (!fs.existsSync(registryAllPath)) {
      infos.push('registry-all.json not found locally; CLI will fetch remote registry.')
    } else {
      try {
        const stat = fs.statSync(registryAllPath)
        const ageDays = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24)
        if (ageDays > 7) {
          infos.push(
            `registry-all.json is older than 7 days (${ageDays.toFixed(1)}d); consider re-running registry:build:all.`
          )
        }
        const raw = JSON.parse(fs.readFileSync(registryAllPath, 'utf-8'))
        if (typeof raw.schemaVersion === 'string') {
          infos.push(`registry schemaVersion: ${raw.schemaVersion}`)
        } else {
          infos.push('registry schemaVersion missing; consider rebuilding with latest CLI.')
        }
      } catch {
        // ignore stat errors
      }
    }

    // aliases/components.json
    const componentsJsonPath = path.join(cwd, 'components.json')
    if (!fs.existsSync(componentsJsonPath)) {
      issues.push('components.json not found. Run timkit init.')
    } else {
      const config = readJSON(componentsJsonPath)
      const aliases = config?.aliases || {}
      if (!aliases.components || !aliases.utils) {
        issues.push('components.json missing aliases.components or aliases.utils.')
      }
      // 检查组件输出路径是否存在以降低首次写入失败风险
      if (aliases.components) {
        const compDir = path.join(cwd, aliases.components)
        if (!fs.existsSync(compDir)) {
          infos.push(`components alias path ${aliases.components} does not exist; it will be created on add.`)
        }
      }
      if (config?.tailwind?.css && !fs.existsSync(path.join(cwd, config.tailwind.css))) {
        issues.push(`Tailwind css file ${config.tailwind.css} not found.`)
      }
    }

    if (issues.length === 0) {
      console.log('✅ doctor: no critical issues found.')
      infos.forEach((i) => console.log('ℹ️  ' + i))
    } else {
      console.log('❌ doctor found issues:')
      issues.forEach((i) => console.log(' - ' + i))
      infos.forEach((i) => console.log('ℹ️  ' + i))
      process.exitCode = 1
    }
  })
