<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" class="rounded-sm [&_span]:rounded" /><Label :htmlFor="id" class="sr-only">Square switch
      </Label></div>
</template>
