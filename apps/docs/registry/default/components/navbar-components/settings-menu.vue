<script setup lang="ts">
import { ref } from 'vue'
import { SettingsIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button @click="onDemoClick" :data-clicks="demoClicks" size="icon" variant="ghost" class="rounded-full shadow-none" aria-label="Open edit menu"><SettingsIcon class="text-muted-foreground" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="max-w-64"><DropdownMenuItem>Appearance</DropdownMenuItem><DropdownMenuItem>Preferences</DropdownMenuItem><DropdownMenuItem>API Settings</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
