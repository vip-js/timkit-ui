<script setup lang="ts">
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-vue-next';
import { Tree } from '@/components/ui/tree';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:first:grow"><div><Tree class="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]" :indent="indent" :tree="tree">{{ tree.getItems().map((item) => {
            return (
              <TreeItem key={item.getId()} item={item}>
                <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
                  <span className="flex items-center gap-2">
                    {item.isFolder() ? (
                      item.isExpanded() ? (
                        <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                      ) : (
                        <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                      )
                    ) : (
                      <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                    )}
                    {item.getItemName()}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            )
          }) }}</Tree></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Basic tree with icons ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
