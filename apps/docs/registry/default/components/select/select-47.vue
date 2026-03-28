<script setup lang="ts">
import { Label } from '@timui/vue'
import { MultipleSelector } from '@timui/vue'

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'ember', label: 'Ember.js' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'eleventy', label: 'Eleventy' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'preact', label: 'Preact' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'alpine', label: 'Alpine.js' },
  { value: 'lit', label: 'Lit' },
]
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label>Multiselect with placeholder and clear</Label>
    <MultipleSelector
      :command-props="{ label: 'Select frameworks' }"
      :default-options="frameworks"
      placeholder="Select frameworks"
      empty-indicator="No results found"
    />
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Inspired by
      <a
        class="hover:text-foreground underline"
        href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
        target="_blank"
        rel="noopener nofollow"
      >
        shadcn/ui expansions
      </a>
    </p>
  </div>
</template>
