<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';

const CORRECT_CODE = '6548';
const value = ref('');
const hasGuessed = ref<undefined | boolean>(undefined);

function onSubmit() {
  hasGuessed.value = value.value === CORRECT_CODE;
  if (hasGuessed.value) {
    value.value = '';
  }
}

function handleCodeChange(next: string | number) {
  hasGuessed.value = undefined;
  value.value = String(next).replace(/\D/g, '').slice(0, 4);
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">OTP code</Button>
    </DialogTrigger>
    <DialogContent>
      <div class="flex flex-col items-center gap-2">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <svg class="stroke-zinc-800 dark:stroke-zinc-100" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12" fill="none" stroke-width="8" />
          </svg>
        </div>
        <DialogHeader>
          <DialogTitle class="sm:text-center">{{ hasGuessed ? 'Code verified!' : 'Enter confirmation code' }}</DialogTitle>
          <DialogDescription class="sm:text-center">
            {{ hasGuessed ? 'Your code has been successfully verified.' : `Check your email and enter the code - Try ${CORRECT_CODE}` }}
          </DialogDescription>
        </DialogHeader>
      </div>

      <template v-if="hasGuessed">
        <div class="text-center">
          <DialogClose as-child>
            <Button type="button">Close</Button>
          </DialogClose>
        </div>
      </template>
      <template v-else>
        <div class="space-y-4">
          <div class="*:not-first:mt-2">
            <Label htmlFor="confirmation-code">Confirmation code</Label>
            <Input
              id="confirmation-code"
              :model-value="value"
              @update:modelValue="(next) => handleCodeChange(next ?? '')"
              placeholder="Enter 4-digit code"
              inputMode="numeric"
              maxlength="4"
            />
          </div>
          <Button type="button" class="w-full" @click="onSubmit" :disabled="value.length !== 4">Verify code</Button>
          <p v-if="hasGuessed === false" class="text-muted-foreground text-center text-xs" role="alert" aria-live="polite">
            Invalid code. Please try again.
          </p>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>
