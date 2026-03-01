<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { MultipleSelector } from '@/components/ui/multiple-selector'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label>Multiselect</Label>
      <MultipleSelector
        placeholder="Select frameworks"
        hideClearAllButton
        hidePlaceholderWhenSelected
      />
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Inspired by 
        <a
          class="hover:text-foreground underline"
          href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
          target="_blank"
          rel="noopener nofollow"
        >
          shadcn/ui expansions
        </a>
      </p>
    </div>
</template>
