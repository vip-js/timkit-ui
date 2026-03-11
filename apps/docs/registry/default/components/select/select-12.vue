<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Timezone select (native)</Label><SelectNative :id="id" default-value="Europe/London"><option v-for="({ value, label }, index) in formattedTimezones" :key="index" :key="value" :value="value">{{ label }}</option></SelectNative></div>
</template>
