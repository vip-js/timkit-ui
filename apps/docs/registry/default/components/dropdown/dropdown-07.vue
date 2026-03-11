<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Radio items
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuRadioGroup :value="framework" @update:modelValue="setFramework"><DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem><DropdownMenuRadioItem value="sveltekit" disabled>SvelteKit
          </DropdownMenuRadioItem><DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem><DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>
</template>
