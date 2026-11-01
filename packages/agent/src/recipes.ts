import type { FrameworkId } from './intent'

export interface AgentRecipeFile {
  path: string
  content: string
}

export interface AgentRecipe {
  id: string
  title: string
  description: string
  components: string[]
  frameworks: Array<'react' | 'vue'>
  files: {
    react?: AgentRecipeFile
    vue?: AgentRecipeFile
  }
}

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

export const agentRecipes: AgentRecipe[] = [
  {
    id: 'login-form',
    title: 'Login form',
    description: 'Email and password sign-in using Card, Label, Input, and Button.',
    components: ['card', 'label', 'input', 'button'],
    frameworks: ['react', 'vue'],
    files: {
      react: { path: 'LoginForm.tsx', content: loginReact },
      vue: { path: 'LoginForm.vue', content: loginVue },
    },
  },
  {
    id: 'confirm-dialog',
    title: 'Confirm dialog',
    description: 'Dialog with a titled description and cancel/confirm buttons.',
    components: ['dialog', 'button'],
    frameworks: ['react', 'vue'],
    files: {
      react: { path: 'ConfirmDialog.tsx', content: confirmReact },
      vue: { path: 'ConfirmDialog.vue', content: confirmVue },
    },
  },
  {
    id: 'notification-setting',
    title: 'Notification setting',
    description: 'Labelled switch for a single boolean setting.',
    components: ['label', 'switch'],
    frameworks: ['react', 'vue'],
    files: {
      react: { path: 'NotificationSetting.tsx', content: settingsReact },
      vue: { path: 'NotificationSetting.vue', content: settingsVue },
    },
  },
  {
    id: 'agent-workbench',
    title: 'Agent workbench',
    description:
      'A support-agent thread with a plan, a tool call, a human approval, and citations.',
    components: [
      'agent-message',
      'agent-plan',
      'tool-call',
      'approval-card',
      'citation-list',
      'agent-composer',
    ],
    frameworks: ['react'],
    files: {
      react: { path: 'AgentWorkbench.tsx', content: workbenchReact },
    },
  },
]

export const recipeFramework = (framework: FrameworkId): 'react' | 'vue' | undefined =>
  framework === 'react' || framework === 'vue' ? framework : undefined
