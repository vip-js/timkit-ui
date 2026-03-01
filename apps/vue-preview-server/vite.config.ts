import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const docsDemoRoot = fileURLToPath(new URL('../docs/registry/default/components', import.meta.url))
const docsVueRoot = fileURLToPath(new URL('../docs/registry/default/vue', import.meta.url))
const packageVueUiRoot = fileURLToPath(new URL('../../packages/vue/src/components/ui', import.meta.url))

function walkVueFiles(rootDir: string): string[] {
    if (!fs.existsSync(rootDir)) return []
    const entries = fs.readdirSync(rootDir, { withFileTypes: true })
    const result: string[] = []

    for (const entry of entries) {
        const fullPath = path.join(rootDir, entry.name)
        if (entry.isDirectory()) {
            result.push(...walkVueFiles(fullPath))
            continue
        }
        if (entry.isFile() && entry.name.endsWith('.vue')) {
            result.push(fullPath)
        }
    }
    return result
}

const packageUiByFileName = new Map<string, string>()
for (const filePath of walkVueFiles(packageVueUiRoot)) {
    const baseName = path.basename(filePath, '.vue')
    if (!packageUiByFileName.has(baseName)) {
        packageUiByFileName.set(baseName, filePath)
    }
}

function resolveUiToken(token: string): string | null {
    if (!token) return null

    const docsEntryVue = path.join(docsVueRoot, `${token}.vue`)
    if (fs.existsSync(docsEntryVue)) return docsEntryVue

    const docsEntryDir = path.join(docsVueRoot, token)
    if (fs.existsSync(docsEntryDir) && fs.statSync(docsEntryDir).isDirectory()) {
        return docsEntryDir
    }

    const packageEntryVue = path.join(packageVueUiRoot, token, `${token}.vue`)
    if (fs.existsSync(packageEntryVue)) return packageEntryVue

    const packageEntryDir = path.join(packageVueUiRoot, token)
    if (fs.existsSync(packageEntryDir) && fs.statSync(packageEntryDir).isDirectory()) {
        return packageEntryDir
    }

    const byFileName = packageUiByFileName.get(token)
    if (byFileName && fs.existsSync(byFileName)) return byFileName

    return null
}

function resolveUiImport(source: string): string | null {
    if (!source.startsWith('@/components/ui/')) return null
    const token = source.slice('@/components/ui/'.length)
    return resolveUiToken(token)
}

const BROKEN_DEMOS = (() => {
    const broken = new Set<string>()
    if (!fs.existsSync(docsDemoRoot)) return []

    const importPattern = /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g
    for (const groupEntry of fs.readdirSync(docsDemoRoot, { withFileTypes: true })) {
        if (!groupEntry.isDirectory()) continue
        const groupDir = path.join(docsDemoRoot, groupEntry.name)
        for (const fileEntry of fs.readdirSync(groupDir, { withFileTypes: true })) {
            if (!fileEntry.isFile() || !fileEntry.name.endsWith('.vue')) continue
            const fullPath = path.join(groupDir, fileEntry.name)
            const source = fs.readFileSync(fullPath, 'utf-8')
            let missingToken = false
            let match: RegExpExecArray | null
            while ((match = importPattern.exec(source))) {
                if (!resolveUiToken(match[1])) {
                    missingToken = true
                    break
                }
            }
            importPattern.lastIndex = 0
            if (missingToken) {
                broken.add(fileEntry.name.replace(/\.vue$/, '').toLowerCase())
            }
        }
    }
    return Array.from(broken)
})()

if (BROKEN_DEMOS.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(`[timui][vue-preview] skipped demos with unresolved ui imports: ${BROKEN_DEMOS.length}`)
}

export default defineConfig({
    define: {
        __TIMUI_DOCS_DEMO_ROOT__: JSON.stringify(
            docsDemoRoot
        ),
        __TIMUI_BROKEN_DEMOS__: JSON.stringify(BROKEN_DEMOS),
    },
    plugins: [vue()],
    server: {
        port: 3002,
        cors: true
    },
    resolve: {
        alias: [
            {
                find: /^@\/components\/ui\/.+$/,
                replacement: '',
                customResolver(source) {
                    return resolveUiImport(source) ?? source
                },
            },
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url)),
            },
        ],
    }
})
