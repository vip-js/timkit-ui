import fs from "fs"
import path from "path"
import { semantic } from "./theme"

const DIST_DIR = path.join(process.cwd(), "dist")

function toCssVarName(path: string[]): string {
    return `--${path.join("-")}`
}

function generateCssVars(obj: any, prefix: string[] = []): string[] {
    let vars: string[] = []
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...prefix, key]
        if (typeof value === "string") {
            vars.push(`${toCssVarName(currentPath)}: ${value};`)
        } else if (typeof value === "object" && value !== null) {
            vars = vars.concat(generateCssVars(value, currentPath))
        }
    }
    return vars
}

function build() {
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true })
    }

    // Generate CSS
    const cssVars = generateCssVars(semantic)
    const cssContent = `:root {\n  ${cssVars.join("\n  ")}\n}\n`
    fs.writeFileSync(path.join(DIST_DIR, "index.css"), cssContent)

    // Generate JSON
    fs.writeFileSync(path.join(DIST_DIR, "tokens.json"), JSON.stringify(semantic, null, 2))

    console.log("Tokens built successfully!")
}

build()
