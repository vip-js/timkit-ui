<script setup lang="ts">
import { Tree } from '@/components/ui/tree';
import { TreeItem } from '@/components/ui/tree-item';
import { TreeItemLabel } from '@/components/ui/tree-item-label';



</script>

<template>
  <div class="flex h-full flex-col gap-2 *:first:grow"><Tree :indent="indent" :tree="tree">{{ tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item}>
              <TreeItemLabel />
            </TreeItem>
          )
        }) }}</Tree><p aria-live="polite" role="region" class="text-muted-foreground mt-2 text-xs">Basic tree with no extra features ∙{{ ' ' }}<a href="https://headless-tree.lukasbach.com" class="hover:text-foreground underline" target="_blank" rel="noopener noreferrer">API
        </a></p></div>
</template>
