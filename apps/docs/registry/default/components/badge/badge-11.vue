<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
</script>

<template>
<Badge class="has-data-[state=unchecked]:bg-muted has-data-[state=unchecked]:text-muted-foreground has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative outline-none has-focus-visible:ring-[3px]">
      <Checkbox id="badge-selectable" class="peer sr-only after:absolute after:inset-0" checked  />
      <svg
        class="hidden peer-data-[state=checked]:block"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <label for="badge-selectable" class="cursor-pointer select-none after:absolute after:inset-0">
        Selectable
      </label>
    </Badge>
</template>
