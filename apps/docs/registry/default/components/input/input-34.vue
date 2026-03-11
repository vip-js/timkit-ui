<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit.vue';


</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with character limit</Label><div class="relative"><Input :id="id" class="peer pe-14" type="text" :value="value" :maxLength="maxLength" :onChange="handleChange" :aria-describedby="`${id}-description`" /><div :id="`${id}-description`" class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50" aria-live="polite" role="status">{{ characterCount }}/{{ limit }}</div></div></div>
</template>
