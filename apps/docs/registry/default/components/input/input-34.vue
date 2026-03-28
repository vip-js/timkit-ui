<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit-vue';

const id = 'input-34';
const maxLength = 50;

const { value, characterCount, maxLength: limit } = useCharacterLimit({ maxLength });
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Input with character limit</Label>
    <div class="relative">
      <Input
        :id="id"
        v-model="value"
        class="peer pe-14"
        type="text"
        :maxLength="maxLength"
        :aria-describedby="`${id}-description`"
      />
      <div
        :id="`${id}-description`"
        class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
        aria-live="polite"
        role="status"
      >
        {{ characterCount }}/{{ limit }}
      </div>
    </div>
  </div>
</template>
