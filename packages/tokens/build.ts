import fs from "fs"
import path from "path"

import { themeTokens } from "./theme"

type FlattenTokenMap = Record<string, string>

const DIST_DIR = path.join(process.cwd(), "packages/tokens/dist")
const CSS_FILE = path.join(DIST_DIR, "theme.css")
const WXSS_FILE = path.join(DIST_DIR, "theme.wxss")

const ensureDist = () => {
  fs.mkdirSync(DIST_DIR, { recursive: true })
}

const flattenTokens = (
  tokens: Record<string, unknown>,
  prefix: string[] = []
): FlattenTokenMap => {
  const acc: FlattenTokenMap = {}
  Object.entries(tokens).forEach(([key, value]) => {
    if (typeof value === "string") {
      acc[[...prefix, key].join(".")] = value
      return
    }

    if (typeof value === "object" && value !== null) {
      Object.assign(acc, flattenTokens(value as Record<string, unknown>, [...prefix, key]))
    }
  })
  return acc
}

const formatDeclaration = (key: string, value: string) =>
  `  --${key.replace(/\./g, "-")}: ${value};`

const writeCss = (tokens: FlattenTokenMap) => {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => formatDeclaration(key, value))
    .join("\n")

  const css = `:root {\n${declarations}\n}\n`
  fs.writeFileSync(CSS_FILE, css)
}

const writeWxss = (tokens: FlattenTokenMap) => {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => formatDeclaration(key, value))
    .join("\n")

  // 在微信端通过 page selector 注入 CSS 变量，供自定义组件消费
  const wxss = `page {\n${declarations}\n}\n`
  fs.writeFileSync(WXSS_FILE, wxss)
}

const main = () => {
  ensureDist()
  const flatTokens = flattenTokens(themeTokens as unknown as Record<string, unknown>)
  writeCss(flatTokens)
  writeWxss(flatTokens)
  // eslint-disable-next-line no-console
  console.log(`Generated ${Object.keys(flatTokens).length} design tokens for web & weapp.`)
}

main()
