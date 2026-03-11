import * as React from 'react'
import type { TagsInputApi } from '@timui/core'

export type TagsInputContextValue = TagsInputApi

const TagsInputContext = React.createContext<TagsInputContextValue | null>(null)

export const TagsInputProvider: React.Provider<TagsInputContextValue | null> =
  TagsInputContext.Provider

export function useTagsInputContext(): TagsInputContextValue {
  const context = React.useContext(TagsInputContext)
  if (!context) {
    throw new Error('TagsInput components must be used within `<TagsInputProvider />`')
  }
  return context
}
