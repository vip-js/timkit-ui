<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { ChevronDownIcon, PhoneIcon } from 'lucide-vue-next';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';

const id = 'input-47';
const country = ref('US');
const localNumber = ref('');

const countryOptions = [
  { value: 'US', label: 'United States', dialCode: '1' },
  { value: 'CN', label: 'China', dialCode: '86' },
  { value: 'GB', label: 'United Kingdom', dialCode: '44' },
  { value: 'JP', label: 'Japan', dialCode: '81' },
];
</script>

<template>
  <div class="*:not-first:mt-2" dir="ltr">
    <Label :htmlFor="id">Phone number input</Label>
    <div class="flex rounded-md shadow-xs">
      <div class="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px]">
        <div class="inline-flex items-center gap-1" aria-hidden="true">
          <PhoneIcon :size="16" aria-hidden="true" />
          <span class="text-muted-foreground/80"><ChevronDownIcon :size="16" aria-hidden="true" /></span>
        </div>
        <select v-model="country" class="absolute inset-0 text-sm opacity-0" aria-label="Select country">
          <option v-for="option in countryOptions" :key="option.value" :value="option.value">
            {{ option.label }} +{{ option.dialCode }}
          </option>
        </select>
      </div>

      <Input
        :id="id"
        class="-ms-px rounded-s-none shadow-none focus-visible:z-10"
        placeholder="Enter phone number"
        type="tel"
        inputMode="tel"
        v-model="localNumber"
      />
    </div>

    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with a Timkit Vue-compatible phone input layout.
    </p>
  </div>
</template>
