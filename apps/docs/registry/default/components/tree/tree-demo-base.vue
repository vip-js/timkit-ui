<script setup lang="ts">
import { Button } from '@timui/vue'
import { Input } from '@timui/vue'
import { Tree } from '@timui/vue'
import { TreeItem } from '@timui/vue'
import { TreeItemLabel } from '@timui/vue'
import {
  BracesIcon,
  CircleXIcon,
  CodeIcon,
  FileCode2Icon,
  FileIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageIcon,
  ListCollapseIcon,
  ListTreeIcon,
  SearchIcon,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

type TreeVariant =
  | 'basic'
  | 'lines'
  | 'icons'
  | 'caret-right'
  | 'multi-select'
  | 'renaming'
  | 'search'
  | 'filter'
  | 'double-click'
  | 'expand-collapse'
  | 'file-editor'
  | 'menu'

type DemoNode = {
  name: string
  children?: string[]
  href?: string
  current?: boolean
  fileExtension?: string
}

type DemoItemApi = {
  getId: () => string
  getProps: () => Record<string, unknown>
  getItemMeta: () => { level: number; itemId: string }
  isFocused: () => boolean
  isFolder: () => boolean
  isSelected: () => boolean
  isDragTarget: () => boolean
  isMatchingSearch: () => boolean
  isExpanded: () => boolean
  isRenaming: () => boolean
  setFocused: () => void
  selectUpTo: () => void
  toggleSelect: () => void
  expand: () => void
  collapse: () => void
  primaryAction: () => void
  getItemName: () => string
  getItemData: () => DemoNode
  getChildren: () => DemoItemApi[]
}

const props = defineProps<{
  variant: TreeVariant
  description: string
}>()

const indent = 20

const BASE_NODES: Record<string, DemoNode> = {
  company: {
    name: 'Company',
    children: ['engineering', 'marketing', 'operations'],
  },
  engineering: {
    name: 'Engineering',
    children: ['frontend', 'backend', 'platform-team'],
  },
  frontend: { name: 'Frontend', children: ['design-system', 'web-platform'] },
  'design-system': {
    name: 'Design System',
    children: ['components', 'tokens', 'guidelines'],
  },
  components: { name: 'Components' },
  tokens: { name: 'Tokens' },
  guidelines: { name: 'Guidelines' },
  'web-platform': { name: 'Web Platform' },
  backend: { name: 'Backend', children: ['apis', 'infrastructure'] },
  apis: { name: 'APIs' },
  infrastructure: { name: 'Infrastructure' },
  'platform-team': { name: 'Platform Team' },
  marketing: { name: 'Marketing', children: ['content', 'seo'] },
  content: { name: 'Content' },
  seo: { name: 'SEO' },
  operations: { name: 'Operations', children: ['hr', 'finance'] },
  hr: { name: 'HR' },
  finance: { name: 'Finance' },
}

const FILE_EDITOR_NODES: Record<string, DemoNode> = {
  app: {
    name: 'app',
    children: ['app/layout.tsx', 'app/page.tsx', 'app/(dashboard)', 'app/api'],
  },
  'app/layout.tsx': { name: 'layout.tsx', fileExtension: 'tsx' },
  'app/page.tsx': { name: 'page.tsx', fileExtension: 'tsx' },
  'app/(dashboard)': {
    name: '(dashboard)',
    children: ['app/(dashboard)/dashboard'],
  },
  'app/(dashboard)/dashboard': {
    name: 'dashboard',
    children: ['app/(dashboard)/dashboard/page.tsx'],
  },
  'app/(dashboard)/dashboard/page.tsx': {
    name: 'page.tsx',
    fileExtension: 'tsx',
  },
  'app/api': { name: 'api', children: ['app/api/hello'] },
  'app/api/hello': { name: 'hello', children: ['app/api/hello/route.ts'] },
  'app/api/hello/route.ts': { name: 'route.ts', fileExtension: 'ts' },
  components: {
    name: 'components',
    children: ['components/button.tsx', 'components/card.tsx'],
  },
  'components/button.tsx': { name: 'button.tsx', fileExtension: 'tsx' },
  'components/card.tsx': { name: 'card.tsx', fileExtension: 'tsx' },
  lib: { name: 'lib', children: ['lib/utils.ts'] },
  'lib/utils.ts': { name: 'utils.ts', fileExtension: 'ts' },
  public: {
    name: 'public',
    children: ['public/favicon.ico', 'public/vercel.svg'],
  },
  'public/favicon.ico': { name: 'favicon.ico', fileExtension: 'ico' },
  'public/vercel.svg': { name: 'vercel.svg', fileExtension: 'svg' },
  'package.json': { name: 'package.json', fileExtension: 'json' },
  'tailwind.config.ts': { name: 'tailwind.config.ts', fileExtension: 'ts' },
  'tsconfig.json': { name: 'tsconfig.json', fileExtension: 'json' },
  'next.config.mjs': { name: 'next.config.mjs', fileExtension: 'mjs' },
  'README.md': { name: 'README.md', fileExtension: 'md' },
  root: {
    name: 'Project Root',
    children: [
      'app',
      'components',
      'lib',
      'public',
      'package.json',
      'tailwind.config.ts',
      'tsconfig.json',
      'next.config.mjs',
      'README.md',
    ],
  },
}

const MENU_NODES: Record<string, DemoNode> = {
  main: { name: 'Documentation', children: ['guides', 'api', 'resources'] },
  guides: { name: 'User Guides', children: ['getting-started', 'advanced'] },
  'getting-started': {
    name: 'Getting Started',
    children: ['installation', 'setup'],
  },
  installation: { name: 'Installation', href: '#', current: true },
  setup: { name: 'Configuration', href: '#' },
  advanced: { name: 'Advanced Usage', href: '#' },
  api: { name: 'API Reference', children: ['endpoints', 'models'] },
  endpoints: { name: 'Endpoints', href: '#' },
  models: { name: 'Data Models', href: '#' },
  resources: { name: 'Resources', children: ['examples', 'faq'] },
  examples: { name: 'Code Examples', href: '#' },
  faq: { name: 'FAQ', href: '#' },
}

const nodes = reactive<Record<string, DemoNode>>({})
const expandedIds = reactive(new Set<string>())
const selectedIds = reactive(new Set<string>())

const focusedId = ref<string | null>(null)
const lastSelectedId = ref<string | null>(null)
const renamingId = ref<string | null>(null)
const renameValue = ref('')
const searchValue = ref('')

const isSearchMode = computed(() => props.variant === 'search' || props.variant === 'filter')
const isFilterMode = computed(() => props.variant === 'filter')
const isRenamingMode = computed(() => props.variant === 'renaming')
const isMultiSelectMode = computed(() => props.variant === 'multi-select')
const isExpandActionMode = computed(() => props.variant === 'expand-collapse')
const isDoubleClickMode = computed(() => props.variant === 'double-click')
const isMenuMode = computed(() => props.variant === 'menu')
const isFileEditorMode = computed(() => props.variant === 'file-editor')
const showLines = computed(() => ['lines', 'icons', 'caret-right', 'file-editor'].includes(props.variant))
const showItemIcons = computed(() =>
  [
    'icons',
    'caret-right',
    'multi-select',
    'renaming',
    'search',
    'filter',
    'double-click',
    'expand-collapse',
    'file-editor',
  ].includes(props.variant)
)

const rootClass = computed(() =>
  ['search', 'filter', 'expand-collapse'].includes(props.variant)
    ? 'flex h-full flex-col gap-2 *:nth-2:grow'
    : 'flex h-full flex-col gap-2 *:first:grow'
)

function cloneNodeMap(source: Record<string, DemoNode>) {
  return Object.fromEntries(
    Object.entries(source).map(([id, node]) => [
      id,
      {
        ...node,
        children: node.children ? [...node.children] : undefined,
      },
    ])
  )
}

function resetState() {
  const source = isFileEditorMode.value
    ? FILE_EDITOR_NODES
    : isMenuMode.value
      ? MENU_NODES
      : BASE_NODES

  Object.keys(nodes).forEach((key) => {
    delete nodes[key]
  })

  Object.assign(nodes, cloneNodeMap(source))

  expandedIds.clear()
  selectedIds.clear()

  const defaultExpanded = isFileEditorMode.value
    ? ['app', 'app/(dashboard)', 'app/(dashboard)/dashboard']
    : isMenuMode.value
      ? ['main', 'guides', 'getting-started']
      : ['engineering', 'frontend', 'design-system']

  defaultExpanded.forEach((id) => expandedIds.add(id))

  const defaultSelected = isMultiSelectMode.value
    ? ['components']
    : isMenuMode.value
      ? ['installation']
      : ['components']

  defaultSelected.forEach((id) => selectedIds.add(id))
  focusedId.value = defaultSelected[0] ?? null
  lastSelectedId.value = defaultSelected[0] ?? null
  renamingId.value = null
  renameValue.value = ''
  searchValue.value = ''
}

resetState()

const rootId = computed(() => {
  if (isFileEditorMode.value) return 'root'
  if (isMenuMode.value) return 'main'
  return 'company'
})

const parentMap = computed(() => {
  const map = new Map<string, string>()

  Object.entries(nodes).forEach(([id, node]) => {
    node.children?.forEach((childId) => {
      map.set(childId, id)
    })
  })

  return map
})

const normalizedSearch = computed(() => searchValue.value.trim().toLowerCase())

const matchingIds = computed(() => {
  const ids = new Set<string>()
  const query = normalizedSearch.value

  if (!query) return ids

  Object.entries(nodes).forEach(([id, node]) => {
    if (node.name.toLowerCase().includes(query)) {
      ids.add(id)
    }
  })

  return ids
})

const visibleBySearch = computed(() => {
  if (!isSearchMode.value || !normalizedSearch.value) return null

  const visible = new Set<string>()

  matchingIds.value.forEach((id) => {
    visible.add(id)
    let parentId = parentMap.value.get(id)

    while (parentId) {
      visible.add(parentId)
      parentId = parentMap.value.get(parentId)
    }
  })

  return visible
})

const forceExpandBySearch = computed(
  () => isSearchMode.value && normalizedSearch.value.length > 0
)

function isFolder(id: string) {
  return (nodes[id]?.children?.length ?? 0) > 0
}

function toggleExpand(id: string) {
  if (!isFolder(id)) return

  if (expandedIds.has(id)) {
    expandedIds.delete(id)
  } else {
    expandedIds.add(id)
  }
}

function expandAll() {
  Object.keys(nodes).forEach((id) => {
    if (isFolder(id)) {
      expandedIds.add(id)
    }
  })
}

function collapseAll() {
  expandedIds.clear()
}

function updateSelection(id: string, event?: MouseEvent) {
  if (isMultiSelectMode.value && event?.shiftKey && lastSelectedId.value) {
    const ids = visibleItems.value.map((item) => item.getId())
    const start = ids.indexOf(lastSelectedId.value)
    const end = ids.indexOf(id)

    if (start > -1 && end > -1) {
      const [from, to] = start <= end ? [start, end] : [end, start]
      selectedIds.clear()
      for (let index = from; index <= to; index += 1) {
        selectedIds.add(ids[index])
      }
      return
    }
  }

  if (isMultiSelectMode.value && (event?.metaKey || event?.ctrlKey)) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id)
    } else {
      selectedIds.add(id)
    }
    lastSelectedId.value = id
    return
  }

  selectedIds.clear()
  selectedIds.add(id)
  lastSelectedId.value = id
}

function handleItemClick(id: string, event?: MouseEvent) {
  focusedId.value = id
  updateSelection(id, event)

  if (isDoubleClickMode.value) {
    return
  }

  if (isFolder(id)) {
    toggleExpand(id)
  }
}

function handleItemDoubleClick(id: string) {
  if (isFolder(id)) {
    toggleExpand(id)
  }
}

function startRenaming(id: string) {
  if (!isRenamingMode.value || !id) return

  renamingId.value = id
  renameValue.value = nodes[id]?.name ?? ''
}

function commitRename(id: string) {
  if (!isRenamingMode.value || renamingId.value !== id) return

  const nextName = renameValue.value.trim()
  if (nextName) {
    nodes[id].name = nextName
  }

  renamingId.value = null
}

function cancelRename() {
  renamingId.value = null
  renameValue.value = ''
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (!isRenamingMode.value) return

  if (event.key === 'F2' && focusedId.value) {
    event.preventDefault()
    startRenaming(focusedId.value)
    return
  }

  if (event.key === 'Escape' && renamingId.value) {
    event.preventDefault()
    cancelRename()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})

function buildItem(id: string, level: number): DemoItemApi {
  return {
    getId: () => id,
    getProps: () => ({
      onClick: (event: MouseEvent) => handleItemClick(id, event),
      onDblclick: () => handleItemDoubleClick(id),
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleItemClick(id)
        }
      },
      tabindex: 0,
      role: 'treeitem',
    }),
    getItemMeta: () => ({ level, itemId: id }),
    isFocused: () => focusedId.value === id,
    isFolder: () => isFolder(id),
    isSelected: () => selectedIds.has(id),
    isDragTarget: () => false,
    isMatchingSearch: () => matchingIds.value.has(id),
    isExpanded: () => expandedIds.has(id),
    isRenaming: () => renamingId.value === id,
    setFocused: () => {
      focusedId.value = id
    },
    selectUpTo: () => {
      updateSelection(id)
    },
    toggleSelect: () => {
      if (selectedIds.has(id)) {
        selectedIds.delete(id)
      } else {
        selectedIds.add(id)
      }
    },
    expand: () => {
      expandedIds.add(id)
    },
    collapse: () => {
      expandedIds.delete(id)
    },
    primaryAction: () => {
      handleItemClick(id)
    },
    getItemName: () => nodes[id]?.name ?? '',
    getItemData: () => nodes[id],
    getChildren: () =>
      (nodes[id]?.children ?? []).map((childId) =>
        buildItem(childId, level + 1)
      ),
  }
}

const visibleItems = computed(() => {
  const items: DemoItemApi[] = []
  const visibleSet = visibleBySearch.value

  const walk = (parentId: string, level: number) => {
    const children = nodes[parentId]?.children ?? []

    children.forEach((childId) => {
      if (visibleSet && !visibleSet.has(childId)) {
        return
      }

      items.push(buildItem(childId, level))

      if (isFolder(childId) && (expandedIds.has(childId) || forceExpandBySearch.value)) {
        walk(childId, level + 1)
      }
    })
  }

  walk(rootId.value, 0)
  return items
})

const treeApi = {
  getItems: () => visibleItems.value,
  getContainerProps: () => ({
    role: 'tree',
    'aria-label': 'Tree demo',
  }),
  expandAll,
  collapseAll,
  setSelectedItems: (ids: string[]) => {
    selectedIds.clear()
    ids.forEach((id) => selectedIds.add(id))
  },
  getSearchInputElementProps: () => ({
    value: searchValue.value,
    onInput: (event: Event) => {
      const target = event.target as HTMLInputElement
      searchValue.value = target.value
      if (target.value) {
        expandAll()
      }
    },
  }),
}

function isCurrent(id: string) {
  return Boolean(nodes[id]?.current)
}

function fileIconByExtension(extension?: string) {
  switch (extension) {
    case 'tsx':
    case 'jsx':
      return FileCode2Icon
    case 'ts':
    case 'js':
    case 'mjs':
      return CodeIcon
    case 'json':
      return BracesIcon
    case 'svg':
    case 'ico':
    case 'png':
    case 'jpg':
      return ImageIcon
    case 'md':
      return FileTextIcon
    default:
      return FileIcon
  }
}

function renderIcon(item: DemoItemApi) {
  if (isFileEditorMode.value && !item.isFolder()) {
    return fileIconByExtension(item.getItemData()?.fileExtension)
  }

  if (item.isFolder()) {
    return item.isExpanded() ? FolderOpenIcon : FolderIcon
  }

  return FileIcon
}

function clearSearch() {
  searchValue.value = ''
}

function itemClass() {
  if (isFileEditorMode.value) {
    return 'pb-0!'
  }
  return undefined
}

function labelClass(id: string) {
  if (isFileEditorMode.value) {
    return 'rounded-none py-1'
  }

  if (showLines.value) {
    return 'before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10'
  }

  if (isMenuMode.value && isCurrent(id)) {
    return 'in-data-[current=true]:bg-accent in-data-[current=true]:text-accent-foreground'
  }

  return undefined
}

function shouldShowCustomLabel() {
  return showItemIcons.value
}

function childCount(item: DemoItemApi) {
  if (!item.isFolder()) return 0
  return item.getChildren().length
}

const emptyFilterResults = computed(
  () => isFilterMode.value && normalizedSearch.value.length > 0 && visibleItems.value.length === 0
)
</script>

<template>
  <div :class="rootClass">
    <div v-if="isSearchMode" class="relative">
      <Input
        class="peer ps-9"
        type="search"
        :placeholder="isFilterMode ? 'Filter items...' : 'Quick search...'"
        :value="searchValue"
        @input="(event: Event) => {
          const target = event.target as HTMLInputElement
          searchValue = target.value
          if (target.value) {
            treeApi.expandAll()
          }
        }"
      />
      <div
        class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"
      >
        <component :is="isFilterMode ? FilterIcon : SearchIcon" class="size-4" aria-hidden="true" />
      </div>
      <button
        v-if="isFilterMode && searchValue"
        class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px]"
        aria-label="Clear search"
        @click="clearSearch"
      >
        <CircleXIcon class="size-4" aria-hidden="true" />
      </button>
    </div>

    <div v-if="isExpandActionMode" class="flex items-center gap-2">
      <Button size="sm" variant="outline" @click="treeApi.expandAll">
        <ListTreeIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
        Expand all
      </Button>
      <Button size="sm" variant="outline" @click="treeApi.collapseAll">
        <ListCollapseIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
        Collapse all
      </Button>
    </div>

    <div v-if="showLines">
      <Tree
        class="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
        :indent="indent"
        :tree="treeApi"
      >
        <template v-if="emptyFilterResults">
          <p class="px-3 py-4 text-center text-sm">No items found for "{{ searchValue }}"</p>
        </template>
        <template v-else>
          <TreeItem
            v-for="item in visibleItems"
            :key="item.getId()"
            :item="item"
            :class="itemClass()"
            :as-child="isMenuMode && Boolean(item.getItemData()?.href)"
          >
            <a
              v-if="isMenuMode && item.getItemData()?.href"
              :href="item.getItemData().href"
              :data-current="isCurrent(item.getId()) || undefined"
            >
              <TreeItemLabel :class="labelClass(item.getId())" />
            </a>
            <TreeItemLabel v-else :class="labelClass(item.getId())">
              <template v-if="shouldShowCustomLabel()">
                <span class="flex items-center gap-2" :class="props.variant === 'caret-right' ? '-order-1 flex-1' : undefined">
                  <component :is="renderIcon(item)" class="text-muted-foreground pointer-events-none size-4" />
                  <template v-if="isRenamingMode && item.isRenaming()">
                    <Input
                      v-model="renameValue"
                      auto-focus
                      class="-my-0.5 h-6 px-1"
                      @keydown.enter="commitRename(item.getId())"
                      @keydown.esc="cancelRename"
                      @blur="commitRename(item.getId())"
                    />
                  </template>
                  <template v-else>
                    {{ item.getItemName() }}
                  </template>
                  <span
                    v-if="isExpandActionMode && item.isFolder()"
                    class="text-muted-foreground -ms-1"
                  >
                    ({{ childCount(item) }})
                  </span>
                </span>
              </template>
            </TreeItemLabel>
          </TreeItem>
        </template>
      </Tree>
    </div>

    <Tree v-else :indent="indent" :tree="treeApi">
      <template v-if="emptyFilterResults">
        <p class="px-3 py-4 text-center text-sm">No items found for "{{ searchValue }}"</p>
      </template>
      <template v-else>
        <TreeItem
          v-for="item in visibleItems"
          :key="item.getId()"
          :item="item"
          :class="itemClass()"
          :as-child="isMenuMode && Boolean(item.getItemData()?.href)"
        >
          <a
            v-if="isMenuMode && item.getItemData()?.href"
            :href="item.getItemData().href"
            :data-current="isCurrent(item.getId()) || undefined"
          >
            <TreeItemLabel :class="labelClass(item.getId())" />
          </a>
          <TreeItemLabel v-else :class="labelClass(item.getId())">
            <template v-if="shouldShowCustomLabel()">
              <span class="flex items-center gap-2" :class="props.variant === 'caret-right' ? '-order-1 flex-1' : undefined">
                <component :is="renderIcon(item)" class="text-muted-foreground pointer-events-none size-4" />
                <template v-if="isRenamingMode && item.isRenaming()">
                  <Input
                    v-model="renameValue"
                    auto-focus
                    class="-my-0.5 h-6 px-1"
                    @keydown.enter="commitRename(item.getId())"
                    @keydown.esc="cancelRename"
                    @blur="commitRename(item.getId())"
                  />
                </template>
                <template v-else>
                  {{ item.getItemName() }}
                </template>
                <span
                  v-if="isExpandActionMode && item.isFolder()"
                  class="text-muted-foreground -ms-1"
                >
                  ({{ childCount(item) }})
                </span>
              </span>
            </template>
          </TreeItemLabel>
        </TreeItem>
      </template>
    </Tree>

    <p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">
      {{ props.description }} ∙
      <a
        href="https://headless-tree.lukasbach.com"
        class="hover:text-foreground underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        API
      </a>
    </p>
  </div>
</template>
