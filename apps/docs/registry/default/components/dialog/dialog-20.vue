<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ArrowRightIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';



</script>

<template>
  <Dialog @update:open="{
        if (open) setStep(1)
      }"><DialogTrigger as-child><Button variant="outline">Onboarding</Button></DialogTrigger><DialogContent class="gap-0 p-0 [&>button:last-child]:text-white"><div class="p-2"><img class="w-full rounded-md" src="/dialog-content.png" :width="382" :height="216" alt="dialog" /></div><div class="space-y-6 px-6 pt-3 pb-6"><DialogHeader><DialogTitle>{{ stepContent[step - 1].title }}</DialogTitle><DialogDescription>{{ stepContent[step - 1].description }}</DialogDescription></DialogHeader><div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div class="flex justify-center space-x-1.5 max-sm:order-1"><div v-for="(_, index) in [...Array(totalSteps)]" :key="index" :key="index" :class="cn(
                    'bg-primary size-1.5 rounded-full',
                    index + 1 === step ? 'bg-primary' : 'opacity-20'
                  )" /></div><DialogFooter><DialogClose as-child><Button type="button" variant="ghost">Skip
                </Button></DialogClose>{{ step < totalSteps ? (
                <Button className="group" type="button" onClick={handleContinue}>
                  Next
                  <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Okay</Button>
                </DialogClose>
              ) }}</DialogFooter></div></div></DialogContent></Dialog>
</template>
