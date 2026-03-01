<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div>
    <div class="*:not-first:mt-2">
      <Label>Input with password strength indicator</Label>
      <div class="relative">
        <Input class="pe-9" placeholder="Password" type="password" />
        <button
          class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          aria-label="Show password"
          aria-pressed="false"
          aria-controls="password"
        >
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
        </button>
      </div>
    </div>
    <div
      class="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow="2"
      aria-valuemin="0"
      aria-valuemax="4"
      aria-label="Password strength"
    >
      <div class="h-full bg-orange-500 transition-all duration-500 ease-out" style="width: 50%"></div>
    </div>
    <p class="text-foreground mb-2 text-sm font-medium">
      Weak password. Must contain:
    </p>
    <ul class="space-y-1.5" aria-label="Password requirements">
      <li class="flex items-center gap-2">
         <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-muted-foreground/80"><circle cx="12" cy="12" r="9" /></svg>
        <span class="text-xs text-muted-foreground">At least 8 characters</span>
      </li>
      <li class="flex items-center gap-2">
         <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-muted-foreground/80"><circle cx="12" cy="12" r="9" /></svg>
        <span class="text-xs text-muted-foreground">At least 1 number</span>
      </li>
      <li class="flex items-center gap-2">
         <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-muted-foreground/80"><circle cx="12" cy="12" r="9" /></svg>
        <span class="text-xs text-muted-foreground">At least 1 lowercase letter</span>
      </li>
      <li class="flex items-center gap-2">
         <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-muted-foreground/80"><circle cx="12" cy="12" r="9" /></svg>
        <span class="text-xs text-muted-foreground">At least 1 uppercase letter</span>
      </li>
    </ul>
  </div>
</template>
