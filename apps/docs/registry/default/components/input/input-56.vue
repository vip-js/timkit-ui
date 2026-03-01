<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-56-id">Timestamp</Label>
      <Input id="input-56-id"
        placeholder="00:00:00"
        type="text")}
      />
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with 
        <a
          class="hover:text-foreground underline"
          href="https://github.com/eduardoborges/use-mask-input"
          target="_blank"
          rel="noopener nofollow"
        >
          use-mask-input
        </a>
      </p>
    </div>
</template>
