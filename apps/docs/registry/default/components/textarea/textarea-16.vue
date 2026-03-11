<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit.vue';


</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with characters left</Label><Textarea :id="id" :value="value" :maxLength="maxLength" :onChange="handleChange" :aria-describedby="`${id}-description`" /><p :id="`${id}-description`" class="text-muted-foreground mt-2 text-right text-xs" role="status" aria-live="polite"><span class="tabular-nums">{{ limit - characterCount }}</span>characters left
      </p></div>
</template>
