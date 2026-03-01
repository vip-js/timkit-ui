<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </DialogTrigger>
      <DialogContent>
        <div class="flex flex-col items-center gap-2">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
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
            <Label for="dialog-08-id">Project name</Label>
            <Input id="dialog-08-id"
              type="text"
              placeholder="Type Timkit UI to confirm" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" class="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" class="flex-1">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
</template>
