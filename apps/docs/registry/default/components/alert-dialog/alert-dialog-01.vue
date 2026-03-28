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
  <AlertDialog><AlertDialogTrigger as-child><Button variant="outline">Show Dialog</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Continue</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
</template>
