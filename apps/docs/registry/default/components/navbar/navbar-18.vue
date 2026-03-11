<script setup lang="ts">
import { SparklesIcon, UploadIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import AppToggle from '@/registry/default/components/navbar-components/app-toggle.vue';
import TeamSwitcher from '@/registry/default/components/navbar-components/team-switcher.vue';


</script>

<template>
  <header class="border-b px-4 md:px-6"><div class="flex h-16 items-center justify-between gap-4"><div class="flex flex-1 items-center gap-2"><TeamSwitcher :teams="teams" :defaultTeam="teams[0]" /></div><AppToggle /><div class="flex flex-1 items-center justify-end gap-2"><Button size="sm" variant="ghost" class="aspect-square text-sm max-sm:p-0"><UploadIcon class="opacity-60 sm:-ms-1" :size="16" aria-hidden="true" /><span class="max-sm:sr-only">Export</span></Button><Button size="sm" class="aspect-square text-sm max-sm:p-0"><SparklesIcon class="opacity-60 sm:-ms-1" :size="16" aria-hidden="true" /><span class="max-sm:sr-only">Upgrade</span></Button></div></div></header>
</template>
