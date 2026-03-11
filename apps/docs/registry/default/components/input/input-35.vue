<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCharacterLimit } from '@/registry/default/hooks/use-character-limit.vue';


</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with characters left</Label><Input :id="id" type="text" :value="value" :maxLength="maxLength" :onChange="handleChange" :aria-describedby="`${id}-description`" /><p :id="`${id}-description`" class="text-muted-foreground mt-2 text-xs" role="status" aria-live="polite"><span class="tabular-nums">{{ limit - characterCount }}</span>characters left
      </p></div>
</template>
