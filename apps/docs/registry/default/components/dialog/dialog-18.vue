<script setup lang="ts">
import { CheckIcon, RefreshCcwIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@timui/vue';
import { Label } from '@timui/vue';
import { RadioGroup } from '@timui/vue';
import { RadioGroupItem } from '@timui/vue';





const id = 'dialog-18';

</script>

<template>
  <Dialog><DialogTrigger as-child><Button variant="outline">Change plan</Button></DialogTrigger><DialogContent><div class="mb-2 flex flex-col gap-2"><div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><RefreshCcwIcon class="opacity-80" :size="16" /></div><DialogHeader><DialogTitle class="text-left">Change your plan</DialogTitle><DialogDescription class="text-left">Pick one of the following plans.
            </DialogDescription></DialogHeader></div><form class="space-y-5"><RadioGroup class="gap-2" default-value="2"><div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none"><RadioGroupItem value="1" :id="`${id}-1`" :aria-describedby="`${id}-1-description`" class="order-1 after:absolute after:inset-0" /><div class="grid grow gap-1"><Label :htmlFor="`${id}-1`">Essential</Label><p :id="`${id}-1-description`" class="text-muted-foreground text-xs">$4 per member/month
                </p></div></div><div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none"><RadioGroupItem value="2" :id="`${id}-2`" :aria-describedby="`${id}-2-description`" class="order-1 after:absolute after:inset-0" /><div class="grid grow gap-1"><Label :htmlFor="`${id}-2`">Standard</Label><p :id="`${id}-2-description`" class="text-muted-foreground text-xs">$19 per member/month
                </p></div></div><div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none"><RadioGroupItem value="3" :id="`${id}-3`" :aria-describedby="`${id}-3-description`" class="order-1 after:absolute after:inset-0" /><div class="grid grow gap-1"><Label :htmlFor="`${id}-3`">Enterprise</Label><p :id="`${id}-3-description`" class="text-muted-foreground text-xs">$32 per member/month
                </p></div></div></RadioGroup><div class="space-y-3"><p><strong class="text-sm font-medium">Features include:</strong></p><ul class="text-muted-foreground space-y-2 text-sm"><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />Create unlimited projects.
              </li><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />Remove watermarks.
              </li><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />Add unlimited users and free viewers.
              </li><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />Upload unlimited files.
              </li><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />7-day money back guarantee.
              </li><li class="flex gap-2"><CheckIcon :size="16" class="text-primary mt-0.5 shrink-0" aria-hidden="true" />Advanced permissions.
              </li></ul></div><div class="grid gap-2"><Button type="button" class="w-full">Change plan
            </Button><DialogClose as-child><Button type="button" variant="ghost" class="w-full">Cancel
              </Button></DialogClose></div></form></DialogContent></Dialog>
</template>
