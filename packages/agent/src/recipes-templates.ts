import type { AgentRecipeFile } from './recipes-types'

const loginReact = `import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@timui/react'

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" aria-label="Email" placeholder="you@example.com" />
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" aria-label="Password" placeholder="Password" />
        <Button type="submit">Sign in</Button>
      </CardContent>
    </Card>
  )
}
`

const loginVue = `<script setup lang="ts">
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@timui/vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Sign in</CardTitle>
    </CardHeader>
    <CardContent>
      <Label html-for="email">Email</Label>
      <Input id="email" type="email" aria-label="Email" placeholder="you@example.com" />
      <Label html-for="password">Password</Label>
      <Input id="password" type="password" aria-label="Password" placeholder="Password" />
      <Button type="submit">Sign in</Button>
    </CardContent>
  </Card>
</template>
`

const confirmReact = `import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@timui/react'

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete item</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
`

const confirmVue = `<script setup lang="ts">
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@timui/vue'
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>Delete</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete item</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
`

const settingsReact = `import { Label, Switch } from '@timui/react'

export function NotificationSetting() {
  return (
    <div>
      <Label htmlFor="notifications">Email notifications</Label>
      <Switch id="notifications" aria-label="Email notifications" />
    </div>
  )
}
`

const settingsVue = `<script setup lang="ts">
import { Label, Switch } from '@timui/vue'
</script>

<template>
  <div>
    <Label html-for="notifications">Email notifications</Label>
    <Switch id="notifications" aria-label="Email notifications" />
  </div>
</template>
`

const workbenchReact = `import { AgentComposer, AgentMessage, AgentPlan, ApprovalCard, CitationList, ToolCall } from '@timui/react/agent'

export function AgentWorkbench() {
  return (
    <div>
      <AgentMessage role="user">Refund order 1842.</AgentMessage>
      <AgentMessage role="assistant">
        <AgentPlan steps={[{ id: 'lookup', label: 'Look up the order', status: 'done' }]} />
        <ToolCall name="orders.get" status="succeeded" input="id=1842">
          Order 1842 is eligible for a refund.
        </ToolCall>
        <ApprovalCard
          title="Refund 48 dollars"
          description="Wait for a person before sending the refund."
          status="pending"
          onApprove={() => undefined}
          onReject={() => undefined}
        />
        <CitationList
          items={[{ id: 'policy', title: 'Refund policy', href: 'https://example.com/refunds', source: 'Help center' }]}
        />
      </AgentMessage>
      <AgentComposer value="" onValueChange={() => undefined} onSubmit={() => undefined} />
    </div>
  )
}
`

const files: Record<string, Partial<Record<'react' | 'vue', AgentRecipeFile>>> = {
  'login-form': {
    react: { path: 'LoginForm.tsx', content: loginReact },
    vue: { path: 'LoginForm.vue', content: loginVue },
  },
  'confirm-dialog': {
    react: { path: 'ConfirmDialog.tsx', content: confirmReact },
    vue: { path: 'ConfirmDialog.vue', content: confirmVue },
  },
  'notification-setting': {
    react: { path: 'NotificationSetting.tsx', content: settingsReact },
    vue: { path: 'NotificationSetting.vue', content: settingsVue },
  },
  'agent-workbench': {
    react: { path: 'AgentWorkbench.tsx', content: workbenchReact },
  },
}

export const getRecipeFile = (
  id: string,
  framework: 'react' | 'vue'
): AgentRecipeFile | undefined => files[id]?.[framework]
