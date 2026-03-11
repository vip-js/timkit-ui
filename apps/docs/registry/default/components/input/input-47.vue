<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDownIcon, PhoneIcon } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div class="*:not-first:mt-2" dir="ltr"><Label :htmlFor="id">PhoneIcon number input</Label><RPNInput.default class="flex rounded-md shadow-xs" international :flagComponent="FlagComponent" :countrySelectComponent="CountrySelect" :inputComponent="PhoneInput" :id="id" placeholder="Enter phone number" :value="value" :onChange="(newValue) => setValue(newValue ?? '')" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://gitlab.com/catamphetamine/react-phone-number-input" target="_blank" rel="noopener nofollow">react-phone-number-input
        </a></p></div>
</template>
