<script setup lang="ts">
import { Label } from '@timui/vue'
import { ListBox } from '@timui/vue'
import { ListBoxItem } from '@timui/vue'
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label>Listbox with multiple options</Label>
    <div class="border-input overflow-hidden rounded-md border">
      <ListBox
        class="bg-background max-h-72 min-h-20 space-y-1 overflow-auto p-1 text-sm shadow-xs transition-[color,box-shadow]"
        aria-label="Select framework"
        selectionMode="multiple"
        :defaultValue="['react', 'vue']"
      >
        <ListBoxItem
          id="react"
          class="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]"
        >
          React
        </ListBoxItem>
        <ListBoxItem
          id="vue"
          class="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]"
        >
          Vue
        </ListBoxItem>
        <ListBoxItem
          id="angular"
          class="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]"
        >
          Angular
        </ListBoxItem>
        <ListBoxItem
          id="svelte"
          class="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px]"
        >
          Svelte
        </ListBoxItem>
      </ListBox>
    </div>
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with
      <a
        class="hover:text-foreground underline"
        href="https://zagjs.com/"
        target="_blank"
        rel="noopener nofollow"
      >
        Zag.js
      </a>
    </p>
  </div>
</template>
