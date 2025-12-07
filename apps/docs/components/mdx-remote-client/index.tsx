'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

type Props = {
  mdxSource: MDXRemoteSerializeResult
  components?: any
}

const MDXRemoteClient = ({ mdxSource, components }: Props) => (
  <MDXRemote {...mdxSource} components={components} />
)

export default MDXRemoteClient
