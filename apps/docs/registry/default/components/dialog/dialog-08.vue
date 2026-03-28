<script setup lang="ts">
import { ref } from 'vue';
import { CircleAlertIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';

const PROJECT_NAME = 'Timkit UI';
const id = 'dialog-08';
const inputValue = ref('');
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">Delete project</Button>
    </DialogTrigger>
    <DialogContent>
      <div class="flex flex-col items-center gap-2">
        <div class="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
          <CircleAlertIcon class="opacity-80" :size="16" />
        </div>
        <DialogHeader>
          <DialogTitle class="sm:text-center">Final confirmation</DialogTitle>
          <DialogDescription class="sm:text-center">
            This action cannot be undone. To confirm, please enter the project name
            <span class="text-foreground">Timkit UI</span>.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form class="space-y-5">
        <div class="*:not-first:mt-2">
          <Label :htmlFor="id">Project name</Label>
          <Input
            :id="id"
            type="text"
            placeholder="Type Timkit UI to confirm"
            v-model="inputValue"
          />
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline" class="flex-1">Cancel</Button>
          </DialogClose>
          <Button type="button" class="flex-1" :disabled="inputValue !== PROJECT_NAME">Delete</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
