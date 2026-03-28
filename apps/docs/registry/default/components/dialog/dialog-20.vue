<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@timui/core'
import { ArrowRightIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@timui/vue'

const step = ref(1)

const stepContent = [
  {
    title: 'Welcome to Timkit UI',
    description:
      'Discover a powerful collection of components designed to enhance your development workflow.',
  },
  {
    title: 'Customizable Components',
    description: 'Each component is fully customizable and built with modern web standards in mind.',
  },
  {
    title: 'Ready to Start?',
    description: 'Begin building amazing interfaces with our comprehensive component library.',
  },
  {
    title: 'Get Support',
    description:
      'Access our extensive documentation and community resources to make the most of Timkit UI.',
  },
]

const totalSteps = computed(() => stepContent.length)

const handleContinue = () => {
  if (step.value < totalSteps.value) step.value += 1
}

const handleOpenChange = (open: boolean) => {
  if (open) step.value = 1
}
</script>

<template>
  <Dialog @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <Button variant="outline">Onboarding</Button>
    </DialogTrigger>
    <DialogContent class="gap-0 p-0 [&>button:last-child]:text-white">
      <div class="p-2">
        <img class="w-full rounded-md" src="/dialog-content.png" :width="382" :height="216" alt="dialog" />
      </div>
      <div class="space-y-6 px-6 pt-3 pb-6">
        <DialogHeader>
          <DialogTitle>{{ stepContent[step - 1].title }}</DialogTitle>
          <DialogDescription>{{ stepContent[step - 1].description }}</DialogDescription>
        </DialogHeader>
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex justify-center space-x-1.5 max-sm:order-1">
            <div
              v-for="(_, index) in totalSteps"
              :key="index"
              :class="
                cn('bg-primary size-1.5 rounded-full', index + 1 === step ? 'bg-primary' : 'opacity-20')
              "
            />
          </div>
          <DialogFooter>
            <DialogClose as-child>
              <Button type="button" variant="ghost">Skip</Button>
            </DialogClose>
            <template v-if="step < totalSteps">
              <Button class="group" type="button" @click="handleContinue">
                Next
                <ArrowRightIcon
                  class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                  :size="16"
                  aria-hidden="true"
                />
              </Button>
            </template>
            <template v-else>
              <DialogClose as-child>
                <Button type="button">Okay</Button>
              </DialogClose>
            </template>
          </DialogFooter>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
