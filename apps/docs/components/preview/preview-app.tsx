'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { RegistryItem } from '@timui/core'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { CodeBlock, Component, ComponentCards, ComponentDetails } from '@/types/types'
import { SectionCodeGroup } from '@/lib/sections'

import Preview from '.'

export interface ComponentData extends Component, ComponentDetails, CodeBlock {
  sourceName?: string
  mdxSource: MDXRemoteSerializeResult
  codeGroups?: SectionCodeGroup[]
  registryStub?: RegistryItem
}

interface Props {
  components: ComponentData[]
}

const PreviewApp = ({ components }: Props) => {
  const pathname = usePathname()

  return (
    <>
      {components?.map((item: ComponentData, idx: number) =>
        item.isActive ? (
          <div key={idx}>
            <Preview item={item} mdxSource={item.mdxSource} slug={pathname} />
          </div>
        ) : (
          ''
        )
      )}
    </>
  )
}

export default PreviewApp
