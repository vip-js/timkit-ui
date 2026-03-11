'use client'

import type { ComponentType } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  components?: Record<string, ComponentType<Record<string, never>>>
}

const MDXRemoteClient = ({ mdxSource, components }: Props) => (
  <MDXRemote {...mdxSource} components={components} />
)

export default MDXRemoteClient
