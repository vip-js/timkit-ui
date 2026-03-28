<script setup lang="ts">
import { Label } from '@timui/vue'
import { MultipleSelector } from '@timui/vue'

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js', disable: true },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'angular', label: 'Angular' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'ember', label: 'Ember.js' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'eleventy', label: 'Eleventy', disable: true },
  { value: 'solid', label: 'SolidJS' },
  { value: 'preact', label: 'Preact' },
  { value: 'qwik', label: 'Qwik' },
  { value: 'alpine', label: 'Alpine.js' },
  { value: 'lit', label: 'Lit' },
]
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label>Multiselect</Label>
    <MultipleSelector
      :command-props="{ label: 'Select frameworks' }"
      :value="frameworks.slice(0, 2)"
      :default-options="frameworks"
      placeholder="Select frameworks"
      hide-clear-all-button
      hide-placeholder-when-selected
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
