<script setup lang="ts">
import { ref } from 'vue';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@timui/vue';



const theme = ref<Theme>('system');


function setTheme(next: typeof theme.value | ((prev: typeof theme.value) => typeof theme.value)) {
  theme.value = typeof next === 'function'
    ? (next as (prev: typeof theme.value) => typeof theme.value)(theme.value)
    : next;
}

</script>

<template>
  <div><DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="outline" aria-label="Select theme"><SunIcon v-if="displayTheme === 'light'" :size="16" aria-hidden="true" /><MoonIcon v-if="displayTheme === 'dark'" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="min-w-32"><DropdownMenuItem @click="setTheme('light')"><SunIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Light</span></DropdownMenuItem><DropdownMenuItem @click="setTheme('dark')"><MoonIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Dark</span></DropdownMenuItem><DropdownMenuItem @click="setTheme('system')"><MonitorIcon :size="16" class="opacity-60" aria-hidden="true" /><span>System</span></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
</template>
