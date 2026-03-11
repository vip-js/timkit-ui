<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Timezone select</Label><Select default-value="Europe/London"><SelectTrigger :id="id"><SelectValue placeholder="Select timezone" /></SelectTrigger><SelectContent><SelectItem v-for="({ value, label }, index) in formattedTimezones" :key="index" :key="value" :value="value">{{ label }}</SelectItem></SelectContent></Select></div>
</template>
