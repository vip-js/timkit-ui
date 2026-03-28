<script setup lang="ts">
import { ref } from 'vue';
import { LoaderCircleIcon, MicIcon, SearchIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';

const id = 'input-27';
const inputValue = ref('');
const isLoading = ref(false);
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Search input with loader</Label>
    <div class="relative">
      <Input :id="id" class="peer ps-9 pe-9" placeholder="Search..." type="search" v-model="inputValue" />
      <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <template v-if="isLoading">
          <LoaderCircleIcon class="animate-spin" :size="16" role="status" aria-label="Loading..." />
        </template>
        <template v-else>
          <SearchIcon :size="16" aria-hidden="true" />
        </template>
      </div>
      <button class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" aria-label="Press to speak" type="submit">
        <MicIcon :size="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
