import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Command } from 'commander'
import prompts from 'prompts'
import { z } from 'zod'

import { runDoctor } from '../lib/doctor-runner'
import { detectTailwindVersion, getPackageManager, writeFileSafely } from '../lib/utils'

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean().default(false),
  framework: z.string().optional(),
})

type ComponentsConfig = {
  $schema?: string
  style?: string
  tailwind?: {
    config?: string
    css?: string
    baseColor?: string
    cssVariables?: boolean
    [key: string]: string | boolean | undefined
  }
  aliases?: {
    components?: string
    utils?: string
    [key: string]: string | undefined
  }
}

const parseComponentsConfig = (raw: string): ComponentsConfig => {
  const parsed = JSON.parse(raw) as object | null
  if (!parsed || Array.isArray(parsed)) return {}
  return parsed as ComponentsConfig
}

export const init = new Command()
  .name('init')
  .description('Initialize Timkit UI configuration')
  .option('-y, --yes', 'Skip confirmation prompt', false)
  .option(
    '-c, --cwd <cwd>',
    'the working directory. defaults to the current directory.',
    process.cwd()
  )
  .option('-f, --framework <framework>', 'target framework (react|vue|html|weapp)')
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
    const deps = ['tailwind-merge', 'clsx', 'class-variance-authority']
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
      console.error('❌ Failed to install dependencies. Please resolve and rerun `timui init`.', e)
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
    if (!cssContent.includes('@import "tailwindcss"') && !cssContent.includes('@tailwind base')) {
      // Tailwind v4 setup
      if (!isV3) {
        const importStmt = `@import "tailwindcss";\n`
        cssContent = importStmt + cssContent
        writeFileSafely({ target: cssPath, content: cssContent, cwd, overwrite: options.yes })
        console.log(`\n🎨 Updated ${targetCss} with Tailwind v4 imports`)
      } else {
        // Tailwind v3 setup
        const directives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
        cssContent = directives + cssContent
        writeFileSafely({ target: cssPath, content: cssContent, cwd, overwrite: options.yes })
        console.log(`\n🎨 Updated ${targetCss} with Tailwind v3 directives`)
      }
    }

    // 3.b Tailwind config (v4/v3 switch)
    const tailwindConfigPath = path.join(cwd, 'tailwind.config.ts')
    // 3.b Create tailwind.config.ts for v3 projects (v4 uses CSS-based @theme instead)
    if (!fs.existsSync(tailwindConfigPath) && isV3) {
      const config = `import type { Config } from "tailwindcss"\n\nconst config = {\n  darkMode: ["class"],\n  content: [\n    './pages/**/*.{ts,tsx}',\n    './components/**/*.{ts,tsx}',\n    './app/**/*.{ts,tsx}',\n    './src/**/*.{ts,tsx}',\n  ],\n  prefix: "",\n  theme: {\n    container: {\n      center: true,\n      padding: "2rem",\n      screens: {\n        "2xl": "1400px",\n      },\n    },\n    extend: {\n      colors: {\n        border: "hsl(var(--border))",\n        input: "hsl(var(--input))",\n        ring: "hsl(var(--ring))",\n        background: "hsl(var(--background))",\n        foreground: "hsl(var(--foreground))",\n        primary: {\n          DEFAULT: "hsl(var(--primary))",\n          foreground: "hsl(var(--primary-foreground))",\n        },\n        secondary: {\n          DEFAULT: "hsl(var(--secondary))",\n          foreground: "hsl(var(--secondary-foreground))",\n        },\n        destructive: {\n          DEFAULT: "hsl(var(--destructive))",\n          foreground: "hsl(var(--destructive-foreground))",\n        },\n        muted: {\n          DEFAULT: "hsl(var(--muted))",\n          foreground: "hsl(var(--muted-foreground))",\n        },\n        accent: {\n          DEFAULT: "hsl(var(--accent))",\n          foreground: "hsl(var(--accent-foreground))",\n        },\n        popover: {\n          DEFAULT: "hsl(var(--popover))",\n          foreground: "hsl(var(--popover-foreground))",\n        },\n        card: {\n          DEFAULT: "hsl(var(--card))",\n          foreground: "hsl(var(--card-foreground))",\n        },\n      },\n      borderRadius: {\n        lg: "var(--radius)",\n        md: "calc(var(--radius) - 2px)",\n        sm: "calc(var(--radius) - 4px)",\n      },\n    },\n  },\n  plugins: [require("tailwindcss-animate")],\n} satisfies Config\n\nexport default config\n`
      writeFileSafely({ target: tailwindConfigPath, content: config, cwd, overwrite: options.yes })
      console.log(`\n⚙️  Created tailwind.config.ts (v3 standard)`)
      install(['tailwindcss-animate'], false)
    }

    // 4. Create components.json (Configuration)
    const componentsJsonPath = path.join(cwd, 'components.json')
    let componentsConfig: ComponentsConfig = {}
    if (fs.existsSync(componentsJsonPath)) {
      try {
        componentsConfig = parseComponentsConfig(fs.readFileSync(componentsJsonPath, 'utf-8'))
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

    // 5. Auto-add base registry items (utils, ui-tokens)
    // These are fetched via CLI self-call to share the same add logic and mirror fallback
    console.log('\n📥 Installing base registry items (utils, ui-tokens)...')
    try {
      execSync(`npx @timui/cli add utils ui-tokens -y --cwd ${cwd}`, { stdio: 'inherit' })
    } catch {
      console.warn(
        "⚠️ Failed to auto-add utils/ui-tokens. Please run 'npx @timui/cli add utils ui-tokens' manually."
      )
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
