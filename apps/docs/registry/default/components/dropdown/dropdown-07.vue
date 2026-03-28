<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@timui/vue';



const framework = ref('nextjs');


function setFramework(next: typeof framework.value | ((prev: typeof framework.value) => typeof framework.value)) {
  framework.value = typeof next === 'function'
    ? (next as (prev: typeof framework.value) => typeof framework.value)(framework.value)
    : next;
}

</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Radio items
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuRadioGroup :value="framework" @update:modelValue="setFramework"><DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem><DropdownMenuRadioItem value="sveltekit" disabled>SvelteKit
          </DropdownMenuRadioItem><DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem><DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>
</template>
