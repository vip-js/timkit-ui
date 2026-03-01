<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
</script>
<template>
<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Radio items
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-me-1 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup >
          <DropdownMenuRadioItem value="nextjs">Next.js</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sveltekit" disabled>
            SvelteKit
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="remix">Remix</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="astro">Astro</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
</template>
