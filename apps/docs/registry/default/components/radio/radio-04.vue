<script setup lang="ts">
import { Label } from '@timui/vue';
import { RadioGroup } from '@timui/vue';
import { RadioGroupItem } from '@timui/vue';





const id = 'radio-04';

</script>

<template>
  <RadioGroup class="gap-6" default-value="1"><div class="flex items-start gap-2"><RadioGroupItem value="1" :id="`${id}-1`" :aria-describedby="`${id}-1-description`" /><div class="grid grow gap-2"><Label :htmlFor="`${id}-1`">Small{{ ' ' }}<span class="text-muted-foreground text-xs leading-[inherit] font-normal">(Sublabel)
            </span></Label><p :id="`${id}-1-description`" class="text-muted-foreground text-xs">You can use this card with a label and a description.
          </p></div></div><div class="flex items-start gap-2"><RadioGroupItem value="2" :id="`${id}-2`" :aria-describedby="`${id}-2-description`" /><div class="grid grow gap-2"><Label :htmlFor="`${id}-2`">Large{{ ' ' }}<span class="text-muted-foreground text-xs leading-[inherit] font-normal">(Sublabel)
            </span></Label><p :id="`${id}-2-description`" class="text-muted-foreground text-xs">You can use this card with a label and a description.
          </p></div></div></RadioGroup>
</template>
