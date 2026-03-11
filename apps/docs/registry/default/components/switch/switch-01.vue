<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';



</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch :id="id" /><Label :htmlFor="id" class="sr-only">Simple switch
      </Label></div>
</template>
