import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'

import { detectTailwindVersion, getPackageManager, writeFileSafely } from '../lib/utils'
import { runDoctor } from '../lib/doctor-runner'

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean().default(false),
  framework: z.string().optional(),
})

export const init = new Command()
  .name('init')
  .description('Initialize Timkit UI configuration')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .option('-f, --framework <framework>', 'target framework (react|vue|svelte|html|weapp)')
  .action(async (opts) => {
    const options = initOptionsSchema.parse(opts)
    const cwd = path.resolve(options.cwd)

    console.log(`Initializing in ${cwd}...`)
    const pm = getPackageManager(cwd)
    const ensureDir = (aliasPath: string) => {
      // 去掉 "@/"" 或 "@\\" 前缀，获取相对路径
      const finalPath = aliasPath.replace(/^@[/\\]/, '')
      const abs = path.join(cwd, finalPath)
      if (!fs.existsSync(abs)) {
        fs.mkdirSync(abs, { recursive: true })
      }
    }
    const install = (pkgList: string[], isDev = false) => {
      if (!pkgList.length) return
      const installCmd =
        pm === 'npm' ? (isDev ? 'install -D' : 'install') : isDev ? 'add -D' : 'add'
      execSync(`${pm} ${installCmd} ${pkgList.join(' ')}`, {
        cwd,
        stdio: 'inherit',
      })
    }

    if (!options.yes) {
      const response = await prompts({
        type: 'confirm',
        name: 'proceed',
        message: `This will install dependencies and configure your project. Proceed?`,
        initial: true,
      })
      if (!response.proceed) process.exit(0)
    }

    // 2. Install Dependencies
    const tailwindMajor = detectTailwindVersion(cwd)
    const isV3 = tailwindMajor && tailwindMajor < 4
    const tailwindPkg = isV3 ? 'tailwindcss@^3' : 'tailwindcss@^4.1.1'
    const tailwindPlugin = isV3 ? '@tailwindcss/forms' : '@tailwindcss/postcss@^4.1.1'
    const deps = [
      '@timui/tokens',
      '@timui/shared',
      'tailwind-merge',
      'clsx',
      'class-variance-authority',
    ]
    const devDeps = [tailwindPkg, tailwindPlugin, 'postcss']

    if (tailwindMajor && isV3) {
      console.log(`\nℹ️  Detected Tailwind v${tailwindMajor}. Using v3 config/content globs.`)
    }

    console.log(`\n📦 Installing dependencies with ${pm}...`)
    try {
      install(deps, false)
      install(devDeps, true)
      console.log('✅ Dependencies installed (dev + prod).')
    } catch (e) {
      console.error('❌ Failed to install dependencies. Please resolve and rerun `timkit init`.', e)
      process.exit(1)
    }

    // 3. Setup CSS
    const cssFiles = [
      'app/globals.css',
      'src/app/globals.css',
      'styles/globals.css',
      'src/index.css',
    ]
    let targetCss = cssFiles.find((f) => fs.existsSync(path.join(cwd, f)))

    if (!targetCss) {
      targetCss = 'src/app/globals.css' // Default for Next.js
      const dir = path.dirname(path.join(cwd, targetCss))
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      if (!fs.existsSync(path.join(cwd, targetCss)))
        writeFileSafely({ target: path.join(cwd, targetCss), content: '', cwd, overwrite: false })
      console.log(`\n📄 Created ${targetCss}`)
    }

    const cssPath = path.join(cwd, targetCss)
    let cssContent = fs.readFileSync(cssPath, 'utf-8')

    // Check if @import exists
    if (!cssContent.includes('@timui/tokens')) {
      const importStmt = `@import "tailwindcss";\n@import "@timui/tokens/dist/tailwind.css";\n@import "@timui/shared/dist/index.css";\n`
      cssContent = importStmt + cssContent
      writeFileSafely({ target: cssPath, content: cssContent, cwd, overwrite: options.yes })
      console.log(`\n🎨 Updated ${targetCss} with Tailwind v4 imports`)
    } else {
      console.log(
        `\n⚠️  ${targetCss} already contains imports. Please manually ensure @timui/tokens is imported.`
      )
    }

    // 3.b Tailwind config (v4/v3 自动切换)
    const tailwindConfigPath = path.join(cwd, 'tailwind.config.ts')
    if (!fs.existsSync(tailwindConfigPath)) {
      const isV3 = tailwindMajor && tailwindMajor < 4
      const config = `import { defineConfig } from "tailwindcss"\nimport { timkitTailwindPreset } from "@timui/shared"\n\nexport default defineConfig({\n  presets: [timkitTailwindPreset],\n  ${isV3 ? 'content: ["./src/**/*.{ts,tsx,js,jsx,mdx}","./app/**/*.{ts,tsx,js,jsx,mdx}","./components/**/*.{ts,tsx,js,jsx,mdx}"],\n  plugins: [],' : ''}\n})\n`
      writeFileSafely({ target: tailwindConfigPath, content: config, cwd, overwrite: options.yes })
      console.log(`\n⚙️  Created tailwind.config.ts (${isV3 ? 'v3' : 'v4-ready'})`)
    } else {
      let content = fs.readFileSync(tailwindConfigPath, 'utf-8')
      if (!content.includes('timkitTailwindPreset')) {
        content = content.replace(/presets:\s*\[/, (match) => match + ' timkitTailwindPreset, ')
        if (!content.includes('timkitTailwindPreset')) {
          content = `import { timkitTailwindPreset } from "@timui/shared"\n` + content
        }
        writeFileSafely({
          target: tailwindConfigPath,
          content,
          cwd,
          overwrite: options.yes,
        })
        console.log(`\n🔧 Injected timkitTailwindPreset into existing tailwind.config.ts`)
      } else {
        console.log(`\nℹ️  tailwind.config.ts already includes timkitTailwindPreset.`)
      }
    }

    // 4. Create components.json (Configuration)
    const componentsJsonPath = path.join(cwd, 'components.json')
    let componentsConfig: any = {}
    if (fs.existsSync(componentsJsonPath)) {
      try {
        componentsConfig = JSON.parse(fs.readFileSync(componentsJsonPath, 'utf-8'))
      } catch {
        console.warn('⚠️  Existing components.json is invalid, regenerating.')
      }
    }
    componentsConfig.$schema = componentsConfig.$schema || 'https://ui.timkit.cn/schema.json'
    componentsConfig.style = componentsConfig.style || 'default'
    componentsConfig.tailwind = {
      config: 'tailwind.config.ts',
      css: targetCss,
      baseColor: componentsConfig.tailwind?.baseColor || 'zinc',
      cssVariables: true,
      ...(componentsConfig.tailwind || {}),
    }
    componentsConfig.aliases = {
      components: '@/components',
      utils: '@/lib/utils',
      ...(componentsConfig.aliases || {}),
    }
    // 确保别名目录存在，避免后续写入失败
    ensureDir(componentsConfig.aliases.components || '@/components')
    ensureDir(componentsConfig.aliases.utils || '@/lib/utils')
    // 预生成一个 utils 模板，便于组件引用
    const utilsTarget = path.join(cwd, componentsConfig.aliases.utils.replace(/^@[/\\]/, ''), 'utils.ts')
    if (!fs.existsSync(utilsTarget)) {
      const utilsBoilerplate = `import { type ClassValue, clsx } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n`
      writeFileSafely({
        target: utilsTarget,
        content: utilsBoilerplate,
        cwd,
        overwrite: options.yes,
      })
      console.log(`\n🧰 Created ${path.relative(cwd, utilsTarget)} as default utils helper.`)
    }
    writeFileSafely({
      target: componentsJsonPath,
      content: JSON.stringify(componentsConfig, null, 2),
      cwd,
      overwrite: options.yes,
    })
    console.log('\n⚙️  Updated components.json')

    // 5. 自动运行 doctor，提供即时反馈（不中断 init）
    console.log('\n🔍 Running doctor to verify setup...')
    runDoctor(cwd)

    console.log('\n✅ Initialization complete!')
  })
