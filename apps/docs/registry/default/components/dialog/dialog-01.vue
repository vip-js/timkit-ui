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
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Alert dialog</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Take a moment to review the details provided to ensure you understand the implications.
          </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Okay</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
