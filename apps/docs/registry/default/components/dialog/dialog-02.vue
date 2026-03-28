<script setup lang="ts">
import { CircleAlertIcon } from 'lucide-vue-next';
import { AlertDialog } from '@timui/vue';
import { AlertDialogAction } from '@timui/vue';
import { AlertDialogCancel } from '@timui/vue';
import { AlertDialogContent } from '@timui/vue';
import { AlertDialogDescription } from '@timui/vue';
import { AlertDialogFooter } from '@timui/vue';
import { AlertDialogHeader } from '@timui/vue';
import { AlertDialogTitle } from '@timui/vue';
import { AlertDialogTrigger } from '@timui/vue';
import { Button } from '@timui/vue';




</script>

<template>
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Alert dialog with icon</Button></AlertDialogTrigger><AlertDialogContent><div class="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4"><div class="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><CircleAlertIcon class="opacity-80" :size="16" /></div><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete your account? All your data will be removed.
            </AlertDialogDescription></AlertDialogHeader></div><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Confirm</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
