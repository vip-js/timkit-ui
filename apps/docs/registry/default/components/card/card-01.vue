<script setup lang="ts">
import { Button } from '@timui/vue';
import { Card } from '@timui/vue';
import { CardContent } from '@timui/vue';
import { CardDescription } from '@timui/vue';
import { CardFooter } from '@timui/vue';
import { CardHeader } from '@timui/vue';
import { CardTitle } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';




</script>

<template>
  <Card class="w-[350px]"><CardHeader><CardTitle>Create project</CardTitle><CardDescription>Deploy your new project in one-click.</CardDescription></CardHeader><CardContent><form><div class="grid w-full items-center gap-4"><div class="flex flex-col space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Name of your project" /></div><div class="flex flex-col space-y-1.5"><Label htmlFor="framework">Framework</Label><Select><SelectTrigger id="framework"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent position="popper"><SelectItem value="next">Next.js</SelectItem><SelectItem value="sveltekit">SvelteKit</SelectItem><SelectItem value="astro">Astro</SelectItem><SelectItem value="nuxt">Nuxt.js</SelectItem></SelectContent></Select></div></div></form></CardContent><CardFooter class="flex justify-between"><Button variant="outline">Cancel</Button><Button>Deploy</Button></CardFooter></Card>
</template>
