<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card-content';
import { CardDescription } from '@/components/ui/card-description';
import { CardFooter } from '@/components/ui/card-footer';
import { CardHeader } from '@/components/ui/card-header';
import { CardTitle } from '@/components/ui/card-title';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



</script>

<template>
  <Card class="w-[350px]"><CardHeader><CardTitle>Create project</CardTitle><CardDescription>Deploy your new project in one-click.</CardDescription></CardHeader><CardContent><form><div class="grid w-full items-center gap-4"><div class="flex flex-col space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Name of your project" /></div><div class="flex flex-col space-y-1.5"><Label htmlFor="framework">Framework</Label><Select><SelectTrigger id="framework"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent position="popper"><SelectItem value="next">Next.js</SelectItem><SelectItem value="sveltekit">SvelteKit</SelectItem><SelectItem value="astro">Astro</SelectItem><SelectItem value="nuxt">Nuxt.js</SelectItem></SelectContent></Select></div></div></form></CardContent><CardFooter class="flex justify-between"><Button variant="outline">Cancel</Button><Button>Deploy</Button></CardFooter></Card>
</template>
