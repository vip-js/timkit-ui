<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group-item';



</script>

<template>
  <RadioGroup class="gap-6" :value="selectedValue" @update:modelValue="setSelectedValue"><div><div class="flex items-start gap-2"><RadioGroupItem value="with-expansion" :id="`${radioId}-1`" :aria-describedby="`${radioId}-1-description`" :aria-controls="inputId" /><div class="grow"><div class="grid grow gap-2"><Label :htmlFor="`${radioId}-1`">Radio with expansion</Label><p :id="`${radioId}-1-description`" class="text-muted-foreground text-xs">You can use this radio with a label and a description.
              </p></div><div role="region" :id="inputId" :aria-labelledby="`${radioId}-1`" class="grid transition-all ease-in-out data-[state=collapsed]:grid-rows-[0fr] data-[state=collapsed]:opacity-0 data-[state=expanded]:grid-rows-[1fr] data-[state=expanded]:opacity-100" :data-state="selectedValue === 'with-expansion' ? 'expanded' : 'collapsed'"><div class="pointer-events-none -m-2 overflow-hidden p-2"><div class="pointer-events-auto mt-3"><Input :ref="inputRef" type="text" id="radio-05-additional-info" placeholder="Enter details" aria-label="Additional Information" :disabled="selectedValue !== 'with-expansion'" /></div></div></div></div></div></div><div class="flex items-start gap-2"><RadioGroupItem value="without-expansion" :id="`${radioId}-2`" :aria-describedby="`${radioId}-2-description`" /><div class="grid grow gap-2"><Label :htmlFor="`${radioId}-2`">Radio without expansion</Label><p :id="`${radioId}-2-description`" class="text-muted-foreground text-xs">You can use this checkbox with a label and a description.
          </p></div></div></RadioGroup>
</template>
