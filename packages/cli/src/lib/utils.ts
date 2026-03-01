import fs from 'fs'
import path from 'path'

export function getPackageManager(cwd: string = process.cwd()): 'pnpm' | 'npm' | 'yarn' | 'bun' {
  const userAgent = process.env.npm_config_user_agent
  if (userAgent) {
    if (userAgent.startsWith('pnpm')) return 'pnpm'
    if (userAgent.startsWith('yarn')) return 'yarn'
    if (userAgent.startsWith('npm')) return 'npm'
    if (userAgent.startsWith('bun')) return 'bun'
  }

  // Look for lock files
  if (findLockFile(cwd, 'pnpm-lock.yaml')) return 'pnpm'
  if (findLockFile(cwd, 'yarn.lock')) return 'yarn'
  if (findLockFile(cwd, 'bun.lockb')) return 'bun'
  if (findLockFile(cwd, 'package-lock.json')) return 'npm'

  return 'npm'
}

function findLockFile(cwd: string, lockfile: string): boolean {
  if (fs.existsSync(path.join(cwd, lockfile))) return true
  const parent = path.dirname(cwd)
  if (parent === cwd) return false
  return findLockFile(parent, lockfile)
}

export function backupFile(srcPath: string, cwd: string, overwrite: boolean) {
  if (!fs.existsSync(srcPath) || overwrite) return
  const rel = path.relative(cwd, srcPath)
  const backupRoot = path.join(cwd, '.timui', `backup-${Date.now()}`)
  const backupPath = path.join(backupRoot, rel)
  fs.mkdirSync(path.dirname(backupPath), { recursive: true })
  fs.copyFileSync(srcPath, backupPath)
}

export function writeFileSafely(opts: {
  target: string
  content: string
  cwd: string
  overwrite: boolean
}) {
  const { target, content, cwd, overwrite } = opts
  const dir = path.dirname(target)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  backupFile(target, cwd, overwrite)
  fs.writeFileSync(target, content, 'utf-8')
}

export function detectTailwindVersion(cwd: string): number | null {
  const pkgPath = findPackageJson(cwd)
  if (!pkgPath) return null
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const version = pkg.dependencies?.tailwindcss || pkg.devDependencies?.tailwindcss || null
    if (!version) return null
    const match = version.match(/(\d+)\./)
    return match ? parseInt(match[1], 10) : null
  } catch {
    return null
  }
}

function findPackageJson(cwd: string): string | null {
  const candidate = path.join(cwd, 'package.json')
  if (fs.existsSync(candidate)) return candidate
  const parent = path.dirname(cwd)
  if (parent === cwd) return null
  return findPackageJson(parent)
}

export { findPackageJson }
