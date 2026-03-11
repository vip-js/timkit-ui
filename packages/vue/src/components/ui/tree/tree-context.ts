import { createContext } from 'radix-vue'
import type { Ref } from 'vue'

export type TreeApi = {
  getContainerProps?: () => Record<string, string | number | boolean | undefined>
  getDragLineStyle?: () => Record<string, string | number> | null
}

export type TreeItemApi = {
  getProps?: () => Record<string, string | number | boolean | undefined>
  getItemMeta?: () => { level: number }
  isFocused?: () => boolean
  isFolder?: () => boolean
  isSelected?: () => boolean
  isDragTarget?: () => boolean
  isMatchingSearch?: () => boolean
  isExpanded?: () => boolean
  getItemName?: () => string
}

export interface TreeContextValue {
  indent: Ref<number>
  tree?: TreeApi
}

export interface TreeItemContextValue {
  indent: Ref<number>
  currentItem?: TreeItemApi
}

export const [injectTreeContext, provideTreeContext] = createContext<TreeContextValue>('Tree')

export const [injectTreeItemContext, provideTreeItemContext] =
  createContext<TreeItemContextValue>('TreeItem')
