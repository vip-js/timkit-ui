<script setup lang="ts">
import { FolderIcon, FolderOpenIcon } from 'lucide-vue-next';
import { Tree } from '@/components/ui/tree';
import { TreeDragLine } from '@/components/ui/tree-drag-line';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:first:grow"><Tree :indent="indent" :tree="tree"><AssistiveTreeDescription :tree="tree" />{{ tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
                <span className="flex items-center gap-2">
                  {item.isFolder() &&
                    (item.isExpanded() ? (
                      <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                    ) : (
                      <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                    ))}
                  {item.getItemName()}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        }) }}<TreeDragLine /></Tree><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Tree with multi-select and drag and drop ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
