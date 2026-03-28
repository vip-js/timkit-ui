<script setup lang="ts">
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit-vue';

const id = 'textarea-16';
const maxLength = 180;

const { value, characterCount, maxLength: limit } = useCharacterLimit({ maxLength });
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Textarea with characters left</Label>
    <Textarea
      :id="id"
      v-model="value"
      :maxLength="maxLength"
      :aria-describedby="`${id}-description`"
    />
    <p :id="`${id}-description`" class="text-muted-foreground mt-2 text-right text-xs" role="status" aria-live="polite">
      <span class="tabular-nums">{{ limit - characterCount }}</span> characters left
    </p>
  </div>
</template>
