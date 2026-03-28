<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '@timui/vue';
import { TagsInput } from '@timui/vue';
import { TagsInputClearTrigger } from '@timui/vue';
import { TagsInputControl } from '@timui/vue';
import { TagsInputInput } from '@timui/vue';
import { TagsInputItem } from '@timui/vue';

const defaultTags = ['Sport', 'Coding', 'Travel'];

const value = ref(defaultTags);


function setValue(next: typeof value.value | ((prev: typeof value.value) => typeof value.value)) {
  value.value = typeof next === 'function'
    ? (next as (prev: typeof value.value) => typeof value.value)(value.value)
    : next;
}


const id = 'input-58';

</script>

<template>
  <div class="flex flex-col gap-2"><Label :htmlFor="id">Input with tags</Label><TagsInput :value="value" @update:modelValue="setValue"><TagsInputControl><TagsInputItem v-for="(tag, index) in value" :key="index" :index="index" :value="tag" /><TagsInputInput placeholder="Add a tag" /></TagsInputControl><TagsInputClearTrigger /></TagsInput><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with <span class="text-foreground">TimUI TagsInput</span></p></div>
</template>
