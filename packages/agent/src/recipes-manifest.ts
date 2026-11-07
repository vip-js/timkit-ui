import type { AgentRecipe } from './recipes-types'

export const agentRecipeManifest: Array<
  Pick<AgentRecipe, 'id' | 'title' | 'description' | 'components' | 'frameworks'>
> = [
  {
    id: 'login-form',
    title: 'Login form',
    description: 'Email and password sign-in using Card, Label, Input, and Button.',
    components: ['card', 'label', 'input', 'button'],
    frameworks: ['react', 'vue'],
  },
  {
    id: 'confirm-dialog',
    title: 'Confirm dialog',
    description: 'Dialog with a titled description and cancel/confirm buttons.',
    components: ['dialog', 'button'],
    frameworks: ['react', 'vue'],
  },
  {
    id: 'notification-setting',
    title: 'Notification setting',
    description: 'Labelled switch for a single boolean setting.',
    components: ['label', 'switch'],
    frameworks: ['react', 'vue'],
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
  },
]
