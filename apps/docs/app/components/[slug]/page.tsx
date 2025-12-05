// app/components/[slug]/page.tsx
import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import type { RegistryItem } from "shadcn/registry"

import { getSectionBySlug, getSections } from "@/lib/catalog"
import { extractSectionCode } from "@/lib/sections"
import ComponentCard from "@/components/component-card"
import ComponentExample from "@/components/component-example"
import PageGrid from "@/components/page-grid"
import PageHeader from "@/components/page-header"
import type { ComponentData } from "@/components/preview/preview-app"

type Params = { slug: string }

type PageDetails = {
  description: string
  section_name: string
}

export async function generateStaticParams() {
  return getSections().map((item) => ({
    slug: item.slug.slice(1),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params

  const pageDetails = getSectionBySlug(`/${slug}`) as PageDetails | undefined

  if (!pageDetails) {
    return {
      title: "Page Not Found",
      description: "",
    }
  }

  const title = `${pageDetails.section_name} - Tailwind CSS Components`
  const description = pageDetails.description

  return {
    metadataBase: new URL("https://ui.timkit.cn"),
    alternates: { canonical: `/components/${slug}` },
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  // 1. 查找页面配置
  const pageDetails = getSectionBySlug(`/${slug}`) as PageDetails | undefined

  if (!pageDetails) {
    // 不存在时直接返回 404
    return notFound()
  }

  // 2. 读取 componentsDB/{slug} 目录下的所有 MDX 文件
  const dir = path.join(process.cwd(), `componentsDB/${slug}`)
  let files: string[]
  try {
    files = fs.readdirSync(dir)
  } catch {
    // 目录不存在或无法读取，同样 404
    return notFound()
  }

  // 3. 解析 frontMatter + 序列化 MDX
  const components: ComponentData[] = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(dir, filename)
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data: frontMatter, content } = matter(raw)
      const mdxSource = await serialize(content)
      return { ...(frontMatter as any), mdxSource }
    })
  )

  const sectionComponents = components
    .filter((component) => component.isActive !== false)
    .map((component, index) => {
      const id = `${slug}-${index}`
      const registryStub = {
        name: id,
        type: "registry:component",
        dependencies: [],
        files: [],
        meta: {
          colSpan: 3,
        },
      } as RegistryItem

      return {
        ...component,
        id,
        codeGroups: extractSectionCode(component.ltr, id),
        registryStub,
      }
    })

  // 4. 渲染页面
  return (
    <>
      {/* 使用 PageHeader 统一头部样式 */}
      <PageHeader title={pageDetails.section_name}>
        {pageDetails.description}
      </PageHeader>

      <div className="mt-12">
        <PageGrid>
          {sectionComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component.registryStub}
            >
              <ComponentExample
                variant="section"
                mdxSource={component.mdxSource}
                codeGroups={component.codeGroups}
                title={component.title}
              />
            </ComponentCard>
          ))}
        </PageGrid>
      </div>
    </>
  )
}
