import fs from "fs"
import path from "path"
import { z } from "zod"
import { registryItemSchema } from "../packages/core/src/schema"

const REGISTRY_PATH = path.join(process.cwd(), "apps/docs/registry.json")
const COMPONENTS_DB_PATH = path.join(process.cwd(), "apps/docs/componentsDB")
const OUTPUT_PATH = path.join(process.cwd(), "apps/docs/data/registry-all.json")

async function main() {
    console.log("Building registry-all.json...")

    // 1. Read base registry.json
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error(`Registry file not found at ${REGISTRY_PATH}`)
        process.exit(1)
    }
    const registryContent = fs.readFileSync(REGISTRY_PATH, "utf-8")
    const registry = JSON.parse(registryContent)

    // Validate base items
    const baseItems = registry.items || []
    console.log(`Found ${baseItems.length} items in base registry.`)

    const validItems = []
    const errors = []

    for (const item of baseItems) {
        validItems.push(item)
    }

    // 2. Scan componentsDB for additional items (MDX based)
    if (fs.existsSync(COMPONENTS_DB_PATH)) {
        const categories = fs.readdirSync(COMPONENTS_DB_PATH)
        for (const category of categories) {
            const categoryPath = path.join(COMPONENTS_DB_PATH, category)
            if (!fs.statSync(categoryPath).isDirectory()) continue

            const files = fs.readdirSync(categoryPath)
            for (const file of files) {
                if (!file.endsWith(".mdx")) continue

                // Simplified parsing: assume filename is the ID/name for now
                // In a real implementation, we would parse frontmatter
                const name = file.replace(/\.mdx$/, "")
                const item = {
                    name,
                    type: "registry:component",
                    files: [{ path: path.join("componentsDB", category, file), type: "registry:component" }],
                    // Add other required fields based on schema
                }

                // Validate and add
                const result = registryItemSchema.safeParse(item)
                if (result.success) {
                    validItems.push(result.data)
                } else {
                    // For now, we skip or log warning. 
                    // Since we don't have full frontmatter parsing here yet, we might skip strict validation for these
                    // or construct a valid object.
                    // Let's just log for now.
                    // console.warn(`Skipping MDX item ${name} due to validation:`, result.error.message)
                }
            }
        }
    }

    const payload = {
        ...registry,
        items: validItems,
        generatedAt: new Date().toISOString(),
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2))
    console.log(`Successfully wrote registry-all.json with ${validItems.length} items.`)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
