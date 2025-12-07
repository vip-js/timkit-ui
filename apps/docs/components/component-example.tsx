import type { RegistryItem } from '@timui/core'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { SectionCodeGroup } from '@/lib/sections'
import CodeBlock from '@/components/code-block'
import ComponentDetails from '@/components/component-details'
import ComponentLoaderClient from '@/components/component-loader-client'
import SectionExampleClient from '@/components/section-example-client'

type RegistryExampleProps = {
  variant: 'registry'
  component: RegistryItem
}

type SectionExampleProps = {
  variant: 'section'
  mdxSource: MDXRemoteSerializeResult
  codeGroups: SectionCodeGroup[]
  title?: string
}

type ComponentExampleProps = (RegistryExampleProps | SectionExampleProps) & {
  className?: string
}

export default function ComponentExample(props: ComponentExampleProps) {
  if (props.variant === 'registry') {
    const hasRenderableCode = props.component.files?.some((f) => !!f.content?.trim()) ?? false
    const hasTsx = props.component.files?.some((f) => f.path.endsWith('.tsx'))

    if (!hasRenderableCode) {
      return (
        <div className="border-border/70 bg-muted/40 flex min-h-[300px] flex-col items-center justify-center rounded-xl border px-4 py-10 text-center">
          <p className="text-foreground font-semibold">预览占位：未找到组件源码</p>
          <p className="text-muted-foreground mt-2 text-sm">
            请补充 registry 中该组件的 files.content，或在 blocks-source.json 中添加代码。
          </p>
        </div>
      )
    }

    // If没有 React/TSX 预览，则用代码回退
    if (!hasTsx) {
      const firstFile = props.component.files?.[0]
      const code = firstFile?.content || ''
      return (
        <div className="border-border/70 bg-card relative min-h-[300px] rounded-xl border px-4 py-10 sm:px-10">
          <div className="text-muted-foreground absolute top-4 right-4 text-xs">
            无 React 预览，展示源码片段
          </div>
          <div className="space-y-3">
            <p className="text-foreground text-sm font-semibold">{props.component.name}</p>
            <CodeBlock code={code} lang="tsx" />
          </div>
          <ComponentDetails component={props.component} />
        </div>
      )
    }
  }

  return (
    <div
      className="border-border/70 bg-card relative min-h-[300px] rounded-xl border px-4 py-10 sm:px-10"
      data-component-example
    >
      {props.variant === 'registry' ? (
        <>
          {props.component.meta?.placeholder && (
            <div className="absolute top-4 left-4 text-xs font-semibold text-amber-500">
              占位代码，待替换为真实实现
            </div>
          )}
          {props.component.meta?.clientOnly ? (
            <ComponentLoaderClient component={props.component} />
          ) : (
            <ComponentLoaderClient component={props.component} />
          )}
          <ComponentDetails component={props.component} />
        </>
      ) : (
        <SectionExampleClient
          mdxSource={props.mdxSource}
          codeGroups={props.codeGroups}
          title={props.title}
        />
      )}
    </div>
  )
}
