"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { MDXRemoteSerializeResult } from "next-mdx-remote"

import {
  CodeBlock,
  Component,
  ComponentCards,
  ComponentDetails,
} from "@/types/types"

import Preview from "."

export interface ComponentData extends Component, ComponentDetails, CodeBlock {
  mdxSource: MDXRemoteSerializeResult
}

interface Props {
  components: ComponentData[]
}

export default ({ components }: Props) => {
  const pathname = usePathname()

  return (
    <>
      {components?.map((item: ComponentData, idx: number) =>
        item.isActive ? (
          <div key={idx}>
            <Preview item={item} mdxSource={item.mdxSource} slug={pathname} />
          </div>
        ) : (
          ""
        )
      )}
    </>
  )
}
