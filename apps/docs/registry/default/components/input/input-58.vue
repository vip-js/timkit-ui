<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { TagsInput } from '@/components/ui/tags-input'
import { TagsInputControl } from '@/components/ui/tags-input-control'
import { TagsInputItem } from '@/components/ui/tags-input-item'
import { TagsInputInput } from '@/components/ui/tags-input-input'
import { TagsInputClearTrigger } from '@/components/ui/tags-input-clear-trigger'
</script>
<template>
<div class="flex flex-col gap-2">
      <Label for="input-58-id">Input with tags</Label>
      <TagsInput >
        <TagsInputControl>
          
            <TagsInputItem />
          

            <TagsInputItem />
          

            <TagsInputItem />
          
          <TagsInputInput placeholder="Add a tag" />
        </TagsInputControl>
        <TagsInputClearTrigger />
      </TagsInput>
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with <span class="text-foreground">TimUI TagsInput</span>
      </p>
    </div>
</template>
