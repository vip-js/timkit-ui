<script setup lang="ts">
import { CircleAlertIcon } from 'lucide-vue-next';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { AlertDialogAction } from '@/components/ui/alert-dialog-action';
import { AlertDialogCancel } from '@/components/ui/alert-dialog-cancel';
import { AlertDialogContent } from '@/components/ui/alert-dialog-content';
import { AlertDialogDescription } from '@/components/ui/alert-dialog-description';
import { AlertDialogFooter } from '@/components/ui/alert-dialog-footer';
import { AlertDialogHeader } from '@/components/ui/alert-dialog-header';
import { AlertDialogTitle } from '@/components/ui/alert-dialog-title';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog-trigger';
import { Button } from '@/components/ui/button';



</script>

<template>
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Alert dialog with icon</Button></AlertDialogTrigger><AlertDialogContent><div class="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4"><div class="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><CircleAlertIcon class="opacity-80" :size="16" /></div><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete your account? All your data will be removed.
            </AlertDialogDescription></AlertDialogHeader></div><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Confirm</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
