'use client'

import componentsNames from '@/componentsNames'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

import type { SectionCodeGroup } from '@/lib/sections'
import MDXRemoteClient from '@/components/mdx-remote-client'
import SectionCodeDialog from '@/components/sections/section-code-dialog'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  codeGroups: SectionCodeGroup[]
  title?: string
}

export default function SectionExampleClient({ mdxSource, codeGroups, title }: Props) {
  return (
    <>
      <MDXRemoteClient mdxSource={mdxSource} components={componentsNames} />
      <SectionCodeDialog codeGroups={codeGroups} title={title} />
    </>
  )
}
