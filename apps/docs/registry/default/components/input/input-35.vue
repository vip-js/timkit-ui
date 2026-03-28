<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit-vue';

const id = 'input-35';
const maxLength = 8;

const { value, characterCount, maxLength: limit } = useCharacterLimit({ maxLength });
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Input with characters left</Label>
    <Input
      :id="id"
      v-model="value"
      type="text"
      :maxLength="maxLength"
      :aria-describedby="`${id}-description`"
    />
    <p :id="`${id}-description`" class="text-muted-foreground mt-2 text-xs" role="status" aria-live="polite">
      <span class="tabular-nums">{{ limit - characterCount }}</span> characters left
    </p>
  </div>
</template>
