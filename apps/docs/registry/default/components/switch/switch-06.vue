<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" class="[&_span]:border-input h-3 w-9 border-none outline-offset-[6px] [&_span]:border" /><Label :htmlFor="id" class="sr-only">M2-style switch
      </Label></div>
</template>
