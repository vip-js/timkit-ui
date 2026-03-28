<script setup lang="ts">
import { ref } from 'vue';
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';



const open = ref<boolean>(false);


function setOpen(next: typeof open.value | ((prev: typeof open.value) => typeof open.value)) {
  open.value = typeof next === 'function'
    ? (next as (prev: typeof open.value) => typeof open.value)(open.value)
    : next;
}

</script>

<template>
  <Button class="group rounded-full" variant="outline" size="icon" @click="setOpen((prevState) => !prevState)" :aria-expanded="open" :aria-label="open ? 'Close menu' : 'Open menu'"><PlusIcon class="transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-[135deg]" :size="16" aria-hidden="true" /></Button>
</template>
