<script setup lang="ts">
import { ref } from 'vue';
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';



const checked = ref<boolean>(true);


const id = 'switch-14';


function setChecked(next: typeof checked.value | ((prev: typeof checked.value) => typeof checked.value)) {
  checked.value = typeof next === 'function'
    ? (next as (prev: typeof checked.value) => typeof checked.value)(checked.value)
    : next;
}

</script>

<template>
  <div><div class="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium"><Switch :id="id" :checked="checked" :onCheckedChange="setChecked" class="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto rounded-md [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-sm [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full" /><span class="pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full"><span class="text-[10px] font-medium uppercase">Off</span></span><span class="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full"><span class="text-[10px] font-medium uppercase">On</span></span></div><Label :htmlFor="id" class="sr-only">Labeled switch
      </Label></div>
</template>
