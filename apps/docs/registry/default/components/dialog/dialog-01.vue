<script setup lang="ts">
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
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Alert dialog</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>Take a moment to review the details provided to ensure you understand the implications.
          </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Okay</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
