<script setup lang="ts">
import { Button } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@timui/vue';





const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

</script>

<template>
  <div class="grid grid-cols-2 gap-2"><Sheet v-for="(side, index) in SHEET_SIDES" :key="side"><SheetTrigger as-child><Button variant="outline">{{ side }}</Button></SheetTrigger><SheetContent :side="side"><SheetHeader><SheetTitle>Edit profile</SheetTitle><SheetDescription>Make changes to your profile here. Click save when you're done.
              </SheetDescription></SheetHeader><div class="grid gap-4 py-4"><div class="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" class="text-right">Name
                </Label><Input id="name" value="Pedro Duarte" class="col-span-3" /></div><div class="grid grid-cols-4 items-center gap-4"><Label htmlFor="username" class="text-right">Username
                </Label><Input id="username" value="@peduarte" class="col-span-3" /></div></div><SheetFooter><SheetClose as-child><Button type="submit">Save changes</Button></SheetClose></SheetFooter></SheetContent></Sheet></div>
</template>
