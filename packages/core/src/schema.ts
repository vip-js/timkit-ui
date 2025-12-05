import { z } from "zod"

export const registryItemTypeSchema = z.enum([
    "registry:ui",
    "registry:component",
    "registry:example",
    "registry:block",
    "registry:hook",
    "registry:lib",
    "registry:theme",
    "registry:page",
])

export const registryItemSchema = z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    description: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(
        z.object({
            path: z.string(),
            content: z.string().optional(),
            type: z.enum(["registry:ui", "registry:component", "registry:example", "registry:hook", "registry:lib", "registry:page"]).optional(),
            target: z.string().optional(),
        })
    ).optional(),
    meta: z.record(z.string(), z.any()).optional(),
    docs: z.string().optional(),
    categories: z.array(z.string()).optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>
