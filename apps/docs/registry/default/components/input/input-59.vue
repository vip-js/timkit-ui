<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { TagsInput } from '@/components/ui/tags-input';
import { TagsInputControl } from '@/components/ui/tags-input-control';
import { TagsInputInput } from '@/components/ui/tags-input-input';
import { TagsInputItem } from '@/components/ui/tags-input-item';



</script>

<template>
  <div class="flex flex-col gap-2"><Label :htmlFor="id">Input with inner tags</Label><TagsInput :value="value" @update:modelValue="setValue(details.value)"><TagsInputControl><TagsInputItem v-for="(tag, index) in value" :key="index" :key="index" :index="index" :value="tag" /><TagsInputInput placeholder="Add a tag" /></TagsInputControl></TagsInput><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with <span class="text-foreground">TimUI TagsInput</span></p></div>
</template>
