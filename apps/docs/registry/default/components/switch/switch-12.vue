<script setup lang="ts">
import { ref } from 'vue';
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';



const checked = ref<boolean>(true);


const id = 'switch-12';


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}

</script>

<template>
  <div><div class="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" class="peer data-[state=checked]:bg-input/50 data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full" /><span class="peer-data-[state=checked]:text-muted-foreground/70 pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center"><MoonIcon :size="16" aria-hidden="true" /></span><span class="peer-data-[state=unchecked]:text-muted-foreground/70 pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center"><SunIcon :size="16" aria-hidden="true" /></span></div><Label :htmlFor="id" class="sr-only">Labeled switch
      </Label></div>
</template>
