<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <RadioGroup default-value="1"><div class="flex items-center gap-2"><RadioGroupItem value="1" :id="`${id}-1`" /><Label :htmlFor="`${id}-1`">Option 1</Label></div><div class="flex items-center gap-2"><RadioGroupItem value="2" :id="`${id}-2`" /><Label :htmlFor="`${id}-2`">Option 2</Label></div><div class="flex items-center gap-2"><RadioGroupItem value="3" :id="`${id}-3`" /><Label :htmlFor="`${id}-3`">Option 3</Label></div></RadioGroup>
</template>
