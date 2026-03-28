<script setup lang="ts">
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';

const id = 'select-12';
const timezones = Intl.supportedValuesOf('timeZone');
const formattedTimezones = timezones
  .map((timezone) => {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find((part) => part.type === 'timeZoneName')?.value || '';
    const modifiedOffset = offset === 'GMT' ? 'GMT+0' : offset;

    return {
      value: timezone,
      label: `(${modifiedOffset}) ${timezone.replace(/_/g, ' ')}`,
      numericOffset: parseInt(offset.replace('GMT', '').replace('+', '') || '0'),
    };
  })
  .sort((a, b) => a.numericOffset - b.numericOffset);

</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Timezone select (native)</Label><SelectNative :id="id" default-value="Europe/London"><option v-for="({ value, label }, index) in formattedTimezones" :key="value" :value="value">{{ label }}</option></SelectNative></div>
</template>
