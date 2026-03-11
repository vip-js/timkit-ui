<script setup lang="ts">
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
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Show Dialog</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
