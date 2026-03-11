<script setup lang="ts">
import { FileIcon, FolderIcon, FolderOpenIcon } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Tree } from '@/components/ui/tree';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:first:grow"><Tree :indent="indent" :tree="tree">{{ tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel>
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
                  {item.isRenaming() ? (
                    <Input {...item.getRenameInputProps()} autoFocus className="-my-0.5 h-6 px-1" />
                  ) : (
                    item.getItemName()
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        }) }}</Tree><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Tree with renaming (press F2 to rename) ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
