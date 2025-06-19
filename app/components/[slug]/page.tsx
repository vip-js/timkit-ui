// app/components/[slug]/page.tsx
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import PageHeader from "@/components/page-header"
import PreviewApp, { type ComponentData } from "@/components/preview/preview-app"
import sections from "@/sections/sections.json"

type Params = { slug: string }

type PageDetails = {
  description: string
  section_name: string
}

export async function generateStaticParams() {
  return sections.map((item) => ({
    slug: item.slug.slice(1),
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params

  const pageDetails = sections.find((item) => item.slug === `/${slug}`) as
    | PageDetails
    | undefined

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

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params

  // 1. 查找页面配置
  const pageDetails = sections.find((item) => item.slug === `/${slug}`) as
    | PageDetails
    | undefined

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
      return { ...frontMatter, mdxSource }
    })
  )

  // 4. 渲染页面
  return (
    <>
      {/* 使用 PageHeader 统一头部样式 */}
      <PageHeader title={pageDetails.section_name}>
        {pageDetails.description}
      </PageHeader>

      {/* 主体：预览组件列表 */}
      <div className="mt-12 space-y-12">
        <PreviewApp components={components} />
      </div>
    </>
  )
}
