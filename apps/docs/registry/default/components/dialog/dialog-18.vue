<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change plan</Button>
      </DialogTrigger>
      <DialogContent>
        <div class="mb-2 flex flex-col gap-2">
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <DialogHeader>
            <DialogTitle class="text-left">Change your plan</DialogTitle>
            <DialogDescription class="text-left">
              Pick one of the following plans.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form class="space-y-5">
          <RadioGroup class="gap-2" defaultValue="2">
            
            <div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                value="1" id="dialog-18-id" aria-describedby="dialog-18-id-1-description"
                class="order-1 after:absolute after:inset-0"
              />
              <div class="grid grow gap-1">
                <Label for="dialog-18-id">Essential</Label>
                <p id="dialog-18-id" class="text-muted-foreground text-xs">
                  $4 per member/month
                </p>
              </div>
            </div>
            
            <div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                value="2" id="dialog-18-id" aria-describedby="dialog-18-id-2-description"
                class="order-1 after:absolute after:inset-0"
              />
              <div class="grid grow gap-1">
                <Label for="dialog-18-id">Standard</Label>
                <p id="dialog-18-id" class="text-muted-foreground text-xs">
                  $19 per member/month
                </p>
              </div>
            </div>
            
            <div class="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-3 shadow-xs outline-none">
              <RadioGroupItem
                value="3" id="dialog-18-id" aria-describedby="dialog-18-id-3-description"
                class="order-1 after:absolute after:inset-0"
              />
              <div class="grid grow gap-1">
                <Label for="dialog-18-id">Enterprise</Label>
                <p id="dialog-18-id" class="text-muted-foreground text-xs">
                  $32 per member/month
                </p>
              </div>
            </div>
          </RadioGroup>

          <div class="space-y-3">
            <p>
              <strong class="text-sm font-medium">Features include:</strong>
            </p>
            <ul class="text-muted-foreground space-y-2 text-sm">
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                Create unlimited projects.
              </li>
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                Remove watermarks.
              </li>
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                Add unlimited users and free viewers.
              </li>
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                Upload unlimited files.
              </li>
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                7-day money back guarantee.
              </li>
              <li class="flex gap-2">
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary mt-0.5 shrink-0"><circle cx="12" cy="12" r="9" /></svg>
                Advanced permissions.
              </li>
            </ul>
          </div>

          <div class="grid gap-2">
            <Button type="button" class="w-full">
              Change plan
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" class="w-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
</template>
