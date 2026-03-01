import React from 'react'
import Markdoc from '@markdoc/markdoc'

const config = {
  nodes: {},
  tags: {},
}

export function renderMarkdoc(source: string) {
  const ast = Markdoc.parse(source)
  const content = Markdoc.transform(ast, config)
  return Markdoc.renderers.react(content, React)
}
