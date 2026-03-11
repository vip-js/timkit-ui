<script setup lang="ts">
import { Tree } from '@/components/ui/tree';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:first:grow"><div><Tree class="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]" :indent="indent" :tree="tree"><AssistiveTreeDescription :tree="tree" />{{ tree.getItems().map((item) => {
            return (
              <TreeItem key={item.getId()} item={item} className="pb-0!">
                <TreeItemLabel className="rounded-none py-1">
                  <span className="flex items-center gap-2">
                    {!item.isFolder() &&
                      getFileIcon(
                        item.getItemData()?.fileExtension,
                        'text-muted-foreground pointer-events-none size-4'
                      )}
                    {item.getItemName()}
                  </span>
                </TreeItemLabel>
              </TreeItem>
            )
          }) }}</Tree></div><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">File editor with drag and drop ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
