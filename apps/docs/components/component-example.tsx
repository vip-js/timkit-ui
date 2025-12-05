import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import type { RegistryItem } from "shadcn/registry"

import type { SectionCodeGroup } from "@/lib/sections"
import ComponentDetails from "@/components/component-details"
import ComponentLoader from "@/components/component-loader-server"
import SectionExampleClient from "@/components/section-example-client"

type RegistryExampleProps = {
  variant: "registry"
  component: RegistryItem
}

type SectionExampleProps = {
  variant: "section"
  mdxSource: MDXRemoteSerializeResult
  codeGroups: SectionCodeGroup[]
  title?: string
}

type ComponentExampleProps = (RegistryExampleProps | SectionExampleProps) & {
  className?: string
}

export default function ComponentExample(props: ComponentExampleProps) {
  return (
    <div
      className="border-border/70 bg-card relative min-h-[300px] rounded-xl border px-4 py-10 sm:px-10"
      data-component-example
    >
      {props.variant === "registry" ? (
        <>
          <ComponentLoader component={props.component} />
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
