import type { RegistryItem } from '@timui/core'
import { beforeAll, describe, expect, it } from 'vitest'

import { componentDocsPath } from './docs-map'
import { buildAgentContract, TimkitAgent } from './index'
import { guidanceFor } from './usage'
import { __setRecipeTemplatesForTests } from './lazy-recipes'
import * as recipeTemplates from './recipes-templates'

const button: RegistryItem = {
  name: 'button',
  type: 'registry:ui',
  description: 'A control that triggers an action.',
  meta: {
    frameworks: ['react', 'vue', 'html', 'weapp'],
    tags: ['primitive'],
  },
}

const chat: RegistryItem = {
  name: 'agent-chat-01',
  type: 'registry:block',
  description: 'Mobile agent chat transcript.',
  meta: {
    frameworks: ['react'],
    tags: ['mobile', 'agent', 'chat'],
    viewport: 'mobile',
  },
}

const card: RegistryItem = {
  name: 'card',
  type: 'registry:ui',
  description: 'A surface for grouped content.',
  meta: {
    frameworks: ['react', 'vue'],
    tags: ['primitive'],
  },
}

const agent = new TimkitAgent({
  registryItems: [button, chat, card],
  defaultFramework: 'react',
})

describe('TimkitAgent planning', () => {
  it('maps a Chinese button request to the button registry item', () => {
    const plan = agent.plan({ prompt: '我要一个按钮', framework: 'react' })

    expect(plan.confidence).toBe('high')
    expect(plan.selected.map((item) => item.name)).toContain('button')
    expect(plan.installCommands[0]).toBe('npx timkit add button --yes --framework react')
    expect(plan.selected[0]?.examples[0]?.code).toContain("from '@timui/react'")
    expect(plan.selected[0]?.pitfalls.join(' ')).toContain('aria-label')
  })

  it('does not install unrelated components when nothing matches', () => {
    const plan = agent.plan({
      prompt: 'quantum origami ledger',
      framework: 'react',
      mobile: true,
    })

    expect(plan.confidence).toBe('none')
    expect(plan.selected).toEqual([])
    expect(plan.installCommands).toEqual([])
    expect(plan.clarification).toContain('Do not install')
  })

  it('keeps an earlier component when a follow-up does not name one', () => {
    const session = agent.createSession()
    session.ask('我想要一个按钮')
    const plan = session.reply('改成大号')

    expect(plan.selected.map((item) => item.name)).toContain('button')
    expect(plan.confidence).not.toBe('none')
  })
})

describe('TimkitAgent generation', () => {
  it('emits a non-colliding React example', () => {
    const generated = agent.generateComponent({ name: 'button', framework: 'react' })
    const source = generated.files[0]?.content || ''

    expect(source).toContain("import { Button } from '@timui/react'")
    expect(source).toContain('export function ButtonExample()')
    expect(source).not.toContain('&quot;')
    expect(agent.validateComponent(source, { framework: 'react', component: 'button' }).valid).toBe(
      true
    )
  })

  it('emits Vue, HTML, and WeApp snippets in their own formats', () => {
    const vue =
      agent.generateComponent({ name: 'button', framework: 'vue' }).files[0]?.content || ''
    const html =
      agent.generateComponent({ name: 'input', framework: 'html' }).files[0]?.content || ''
    const weapp =
      agent.generateComponent({ name: 'button', framework: 'weapp' }).files[0]?.content || ''

    expect(vue).toContain("from '@timui/vue'")
    expect(vue).toContain('<template>')
    expect(vue).not.toContain('&quot;')
    expect(html).toContain('aria-label=')
    expect(html).not.toContain('@timui/react')
    expect(weapp).toContain('bind:press')
    expect(weapp).not.toContain('@timui/react')
  })

  it('imports blocks from the installed file instead of the package', () => {
    const generated = agent.generateComponent({ name: 'agent-chat-01', framework: 'react' })
    const source = generated.files[0]?.content || ''

    expect(source).toContain("from '@/components/ui/agent-chat-01'")
    expect(source).not.toContain('@timui/react')
    expect(generated.notes.join(' ')).toContain('default export')
  })

  it('rejects undocumented enum values instead of emitting them', () => {
    const generated = agent.generateComponent({
      name: 'button',
      framework: 'react',
      props: { variant: 'neon' },
    })

    expect(generated.files[0]?.content).not.toContain('neon')
    expect(generated.notes.join(' ')).toContain('Dropped variant="neon"')
  })
})

describe('agent contract', () => {
  it('publishes props and an install command without source file contents', () => {
    const contract = buildAgentContract({
      ...button,
      files: [
        {
          path: 'registry/default/ui/button.tsx',
          content: 'export const secret = true',
          target: 'components/ui/button.tsx',
          type: 'registry:ui',
        },
      ],
    })

    expect(contract.props.find((prop) => prop.name === 'variant')?.values).toContain('outline')
    expect(contract.install).toBe('npx timkit add button --yes --framework react')
    expect(contract.sourceKind).toBe('package')
    expect(contract.examples.some((example) => example.code.includes("from '@timui/react'"))).toBe(
      true
    )
    expect(JSON.stringify(contract.files)).not.toContain('secret')
  })

  it('tells agents to default-import blocks from the installed path', () => {
    const contract = buildAgentContract(chat)

    expect(contract.sourceKind).toBe('registry-file')
    expect(contract.rules.join(' ')).toContain('default export')
    expect(contract.examples.some((example) => example.code.includes('@timui/react'))).toBe(false)
  })
})

describe('TimkitAgent validation', () => {
  it('flags an unknown variant and an icon button without a name', () => {
    const result = agent.validateComponent(
      `import { Button } from '@timui/react'
export function Example() {
  return <Button variant="neon" size="icon"></Button>
}
`,
      { framework: 'react', component: 'button' }
    )

    expect(result.valid).toBe(false)
    expect(result.issues.map((issue) => issue.type)).toEqual(
      expect.arrayContaining(['prop', 'accessibility'])
    )
    expect(result.issues.some((issue) => issue.fix?.includes('default'))).toBe(true)
  })

  it('rewrites invalid snippets once and stays stable', () => {
    const broken = `import { Button } from '@timui/vue'
export function Example() {
  return <Button variant="neon" size="icon"></Button>
}
`
    const once = agent.fixComponent(broken, { framework: 'react', component: 'button' })
    const twice = agent.fixComponent(once.code, { framework: 'react', component: 'button' })

    expect(once.changed).toBe(true)
    expect(once.code).toContain("from '@timui/react'")
    expect(once.code).toContain('variant="default"')
    expect(once.code).toContain('aria-label="Continue"')
    expect(once.code).not.toContain('neon')
    expect(once.validation.valid).toBe(true)
    expect(twice.code).toBe(once.code)
    expect(twice.changes).toEqual([])
  })

  it('reports TypeScript syntax errors', () => {
    const result = agent.validateComponent(
      `export function Broken() {
  return (
    <Button>
  )
}
`,
      { framework: 'react', component: 'button' }
    )

    expect(result.valid).toBe(false)
    expect(result.issues.some((issue) => issue.type === 'syntax')).toBe(true)
  })

  it('tells every component how to restyle it and where the docs live', () => {
    expect(guidanceFor(undefined, 'card').pitfalls.join(' ')).toContain('className')
    expect(componentDocsPath('dropdown-menu')).toBe('dropdown')
    expect(componentDocsPath('button')).toBe('button')
  })

  it('lists the agent business components', () => {
    expect(agent.listAgentUi().map((item) => item.name)).toEqual([
      'AgentMessage',
      'AgentComposer',
      'AgentPlan',
      'ToolCall',
      'ApprovalCard',
      'CitationList',
      'AgentThreadView',
    ])
  })

  beforeAll(() => {
    __setRecipeTemplatesForTests(recipeTemplates)
  })

  it('validates composed recipes for react and vue', () => {
    agent.listRecipes().forEach((recipe) => {
      recipe.frameworks.forEach((framework) => {
        const generated = agent.generateRecipe(recipe.id, framework)
        const source = generated.files[0]?.content || ''
        const result = agent.validateComponent(source, { framework })
        expect(result.issues, `${recipe.id} ${framework}`).toEqual([])
      })
    })
  })

  it('reads installed components from a project snapshot', () => {
    const context = agent.getProjectContext({
      dependencies: { react: '19.0.0' },
      files: [`import { Button, Card } from '@timui/react'`],
    })

    expect(context.framework).toBe('react')
    expect(context.installedComponents).toEqual(['button', 'card'])
    expect(context.warnings).toEqual([])
    expect(context.dependencies.button?.direct).toEqual([])
  })

  it('walks registry dependencies and reports the ones that are not installed', () => {
    const depAgent = new TimkitAgent({
      registryItems: [
        {
          ...button,
          registryDependencies: ['label'],
        },
        {
          name: 'dialog',
          type: 'registry:ui',
          registryDependencies: ['button'],
          meta: { frameworks: ['react'] },
        },
      ],
    })

    expect(depAgent.checkDependencies('dialog')).toMatchObject({
      direct: ['button'],
      transitive: ['label'],
      missing: ['button', 'label'],
    })
    expect(depAgent.checkDependencies('dialog', ['button', 'label']).missing).toEqual([])
    expect(depAgent.checkDependencies('button').dependents).toEqual(['dialog'])
  })

  it('validates vue and weapp snippets and rejects unnamed icon buttons', () => {
    for (const name of ['button', 'input', 'dialog']) {
      for (const framework of ['vue', 'weapp'] as const) {
        const generated = agent.generateComponent({ name, framework })
        const validation = agent.validateComponent(generated.files[0]?.content || '', {
          framework,
          component: name,
          checkSyntax: true,
        })
        expect(validation.valid, `${framework} ${name} ${validation.issues.map((issue) => issue.message).join('; ')}`).toBe(true)
      }
    }

    const unnamed = agent.validateComponent(
      `export function Example(){ return <Button size="icon" /> }`,
      { framework: 'react', component: 'button', checkSyntax: false }
    )
    expect(unnamed.valid).toBe(false)
    expect(unnamed.issues.some((issue) => issue.message.includes('aria-label'))).toBe(true)

    const unnamedWeapp = agent.validateComponent(
      `<t-button size="icon" bind:press="onPress"></t-button>`,
      { framework: 'weapp', component: 'button', checkSyntax: false }
    )
    expect(unnamedWeapp.valid).toBe(false)
    expect(unnamedWeapp.issues.some((issue) => issue.message.includes('aria-label'))).toBe(true)

    const namedWeapp = agent.validateComponent(
      `<t-button size="icon" aria-label="Close" bind:press="onPress"></t-button>`,
      { framework: 'weapp', component: 'button', checkSyntax: false }
    )
    expect(namedWeapp.valid).toBe(true)

    for (const framework of ['react', 'vue', 'html', 'weapp'] as const) {
      const generated = agent.generateComponent({ name: 'dialog', framework })
      const source = generated.files[0]?.content || ''
      const validation = agent.validateComponent(source, {
        framework,
        component: 'dialog',
        checkSyntax: framework === 'react',
      })
      expect(validation.valid, `${framework} ${validation.issues.map((issue) => issue.message).join('; ')}`).toBe(true)
      expect(source.includes('DialogTitle') || /title=|aria-labelledby=/.test(source)).toBe(true)
    }

    const unnamedHtml = agent.validateComponent(`<button type="button" data-slot="button"></button>`, {
      framework: 'html',
      component: 'button',
      checkSyntax: false,
    })
    expect(unnamedHtml.valid).toBe(false)

    const namedHtml = agent.validateComponent(`<button type="button" data-slot="button">Save</button>`, {
      framework: 'html',
      component: 'button',
      checkSyntax: false,
    })
    expect(namedHtml.valid).toBe(true)

    const unlabeled = agent.validateComponent(`<input data-slot="input" type="text" />`, {
      framework: 'html',
      component: 'input',
      checkSyntax: false,
    })
    expect(unlabeled.valid).toBe(false)
    expect(unlabeled.issues.some((issue) => issue.message.includes('aria-label'))).toBe(true)

    const labeled = agent.validateComponent(
      `<label for="email">Email</label><input id="email" data-slot="input" type="text" />`,
      { framework: 'html', component: 'input', checkSyntax: false }
    )
    expect(labeled.valid).toBe(true)

    const untitled = agent.validateComponent(`<Dialog><DialogContent>Continue</DialogContent></Dialog>`, {
      framework: 'react',
      component: 'dialog',
      checkSyntax: false,
    })
    expect(untitled.valid).toBe(false)
    expect(untitled.issues.some((issue) => issue.message.includes('accessible name'))).toBe(true)
  })

  it('resolves sonner and date aliases onto one contract', () => {
    const toast = buildAgentContract(
      { name: 'sonner', type: 'registry:ui', description: 'Toast alias' },
      { registryBaseUrl: 'https://ui.timkit.cn' }
    )
    const dateField = buildAgentContract(
      { name: 'date-field', type: 'registry:ui', description: 'Date field alias' },
      { registryBaseUrl: 'https://ui.timkit.cn' }
    )
    expect(toast.props.length).toBeGreaterThan(0)
    expect(dateField.props.map((prop) => prop.name)).toContain('value')
  })
})
