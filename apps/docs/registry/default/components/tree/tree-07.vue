<script setup lang="ts">
import { FolderIcon, FolderOpenIcon, SearchIcon } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Tree } from '@/components/ui/tree';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:nth-2:grow"><div class="relative"><Input class="peer ps-9" type="search" placeholder="Quick search..." /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"><SearchIcon class="size-4" aria-hidden="true" /></div></div><Tree :indent="indent" :tree="tree">{{ tree.getItems().map((item) => {
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
        }) }}</Tree><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Tree with search highlight ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
