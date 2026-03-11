<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Checkbox items
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuCheckboxItem :checked="nextjs" :onCheckedChange="setNextjs">Next.js
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="sveltekit" :onCheckedChange="setSveltekit">SvelteKit
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="remix" :onCheckedChange="setRemix" disabled>Remix
        </DropdownMenuCheckboxItem><DropdownMenuCheckboxItem :checked="astro" :onCheckedChange="setAstro">Astro
        </DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
</template>
