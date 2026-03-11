<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { MultipleSelector } from '@/components/ui/multiple-selector';



</script>

<template>
  <div class="*:not-first:mt-2"><Label>Multiselect</Label><MultipleSelector :commandProps="{
          label: 'Select frameworks',
        }" :value="frameworks.slice(0, 2)" :defaultOptions="frameworks" placeholder="Select frameworks" hideClearAllButton hidePlaceholderWhenSelected :emptyIndicator="<p className="text-center text-sm">No results found</p>" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Inspired by{{ ' ' }}<a class="hover:text-foreground underline" href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector" target="_blank" rel="noopener nofollow">shadcn/ui expansions
        </a></p></div>
</template>
