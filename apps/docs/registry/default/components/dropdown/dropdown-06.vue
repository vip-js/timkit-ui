<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@timui/vue';



const nextjs = ref<Checked>(false);
const sveltekit = ref<Checked>(true);
const astro = ref<Checked>(false);
const remix = ref<Checked>(false);


function setNextjs(next: typeof nextjs.value | ((prev: typeof nextjs.value) => typeof nextjs.value)) {
  nextjs.value = typeof next === 'function'
    ? (next as (prev: typeof nextjs.value) => typeof nextjs.value)(nextjs.value)
    : next;
}

function setSveltekit(next: typeof sveltekit.value | ((prev: typeof sveltekit.value) => typeof sveltekit.value)) {
  sveltekit.value = typeof next === 'function'
    ? (next as (prev: typeof sveltekit.value) => typeof sveltekit.value)(sveltekit.value)
    : next;
}

function setRemix(next: typeof remix.value | ((prev: typeof remix.value) => typeof remix.value)) {
  remix.value = typeof next === 'function'
    ? (next as (prev: typeof remix.value) => typeof remix.value)(remix.value)
    : next;
}

function setAstro(next: typeof astro.value | ((prev: typeof astro.value) => typeof astro.value)) {
  astro.value = typeof next === 'function'
    ? (next as (prev: typeof astro.value) => typeof astro.value)(astro.value)
    : next;
}

</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Checkbox items
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuCheckboxItem :checked="nextjs" :onCheckedChange="setNextjs">Next.js
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="sveltekit" :onCheckedChange="setSveltekit">SvelteKit
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="remix" :onCheckedChange="setRemix" disabled>Remix
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="astro" :onCheckedChange="setAstro">Astro
        </DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
</template>
