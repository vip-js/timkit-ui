<script setup lang="ts">
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
</script>
<template>
<AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Alert dialog with icon</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div class="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            class="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-80"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? All your data will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
</template>
