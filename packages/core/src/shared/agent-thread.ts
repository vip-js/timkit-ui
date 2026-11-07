export type AgentPlanStepStatus = 'pending' | 'running' | 'done' | 'failed'
export type AgentToolStatus = 'pending' | 'running' | 'succeeded' | 'failed'
export type AgentApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface AgentPlanStepData {
  id: string
  label: string
  detail?: string
  status: AgentPlanStepStatus
}

export interface AgentCitationData {
  id: string
  title: string
  href: string
  source?: string
}

export interface AgentTextPart {
  type: 'text'
  text: string
}

export interface AgentPlanPart {
  type: 'plan'
  steps: AgentPlanStepData[]
}

export interface AgentToolPart {
  type: 'tool'
  id: string
  name: string
  status: AgentToolStatus
  input?: string
  output?: string
  approvalId?: string
}

export interface AgentApprovalPart {
  type: 'approval'
  id: string
  title: string
  description?: string
  status: AgentApprovalStatus
}

export interface AgentCitationPart {
  type: 'citations'
  items: AgentCitationData[]
}

export type AgentPart =
  | AgentTextPart
  | AgentPlanPart
  | AgentToolPart
  | AgentApprovalPart
  | AgentCitationPart

export interface AgentThreadMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  status?: 'idle' | 'streaming' | 'error'
  parts: AgentPart[]
}

export interface AgentThread {
  id: string
  messages: AgentThreadMessage[]
  composer: string
  composerStatus: 'ready' | 'running'
}

export type AgentUiAction =
  | { type: 'composer.change'; text: string }
  | { type: 'composer.submit'; text?: string; messageId?: string }
  | { type: 'composer.settle' }
  | { type: 'assistant.append'; message: AgentThreadMessage }
  | { type: 'approval.decide'; id: string; decision: 'approved' | 'rejected' }
  | { type: 'tool.finish'; id: string; status: 'succeeded' | 'failed'; output?: string }

export interface AgentReduction {
  thread: AgentThread
  accepted: boolean
  reason?: string
}

export interface AgentThreadGates {
  pendingApprovalIds: string[]
  runnableToolIds: string[]
  blockedToolIds: string[]
}

const reject = (thread: AgentThread, reason: string): AgentReduction => ({
  thread,
  accepted: false,
  reason,
})

const accept = (thread: AgentThread): AgentReduction => ({ thread, accepted: true })

export const createAgentThread = (id = 'thread'): AgentThread => ({
  id,
  messages: [],
  composer: '',
  composerStatus: 'ready',
})

const partsOf = (thread: AgentThread) => thread.messages.flatMap((message) => message.parts)

const approvalById = (thread: AgentThread, id: string) =>
  partsOf(thread).find(
    (part): part is AgentApprovalPart => part.type === 'approval' && part.id === id
  )

const toolById = (thread: AgentThread, id: string) =>
  partsOf(thread).find((part): part is AgentToolPart => part.type === 'tool' && part.id === id)

const mapParts = (thread: AgentThread, mapPart: (part: AgentPart) => AgentPart): AgentThread => ({
  ...thread,
  messages: thread.messages.map((message) => ({
    ...message,
    parts: message.parts.map(mapPart),
  })),
})

export const agentThreadGates = (thread: AgentThread): AgentThreadGates => {
  const approvals = new Map<string, AgentApprovalStatus>()
  partsOf(thread).forEach((part) => {
    if (part.type === 'approval') approvals.set(part.id, part.status)
  })

  const pendingApprovalIds: string[] = []
  const runnableToolIds: string[] = []
  const blockedToolIds: string[] = []

  approvals.forEach((status, id) => {
    if (status === 'pending') pendingApprovalIds.push(id)
  })

  partsOf(thread).forEach((part) => {
    if (part.type !== 'tool') return
    const approvalStatus = part.approvalId ? approvals.get(part.approvalId) : undefined
    if (part.approvalId && approvalStatus !== 'approved') {
      if (part.status === 'pending' || part.status === 'running') blockedToolIds.push(part.id)
      return
    }
    if (part.status === 'pending' || part.status === 'running') runnableToolIds.push(part.id)
  })

  return { pendingApprovalIds, runnableToolIds, blockedToolIds }
}

export const describeAgentThread = (thread: AgentThread): string => {
  const gates = agentThreadGates(thread)
  const last = thread.messages[thread.messages.length - 1]
  const lastText = last?.parts.find((part): part is AgentTextPart => part.type === 'text')?.text
  const bits = [
    last ? `Last ${last.role} message: ${lastText || '(no text)'}` : 'No messages yet.',
    thread.composerStatus === 'running' ? 'The agent is running.' : 'The composer is ready.',
  ]
  if (gates.pendingApprovalIds.length) {
    bits.push(`Waiting for approval: ${gates.pendingApprovalIds.join(', ')}.`)
  }
  if (gates.blockedToolIds.length) {
    bits.push(`Blocked tools: ${gates.blockedToolIds.join(', ')}.`)
  }
  if (gates.runnableToolIds.length) {
    bits.push(`Runnable tools: ${gates.runnableToolIds.join(', ')}.`)
  }
  return bits.join(' ')
}

export const reduceAgentThread = (thread: AgentThread, action: AgentUiAction): AgentReduction => {
  if (action.type === 'composer.change') {
    if (thread.composerStatus === 'running')
      return reject(thread, 'The composer is locked while the agent is running.')
    return accept({ ...thread, composer: action.text })
  }

  if (action.type === 'composer.submit') {
    if (thread.composerStatus === 'running') return reject(thread, 'The agent is already running.')
    const text = (action.text ?? thread.composer).trim()
    if (!text) return reject(thread, 'Empty messages are not sent.')
    return accept({
      ...thread,
      composer: '',
      composerStatus: 'running',
      messages: [
        ...thread.messages,
        {
          id: action.messageId || `user-${thread.messages.length + 1}`,
          role: 'user',
          status: 'idle',
          parts: [{ type: 'text', text }],
        },
      ],
    })
  }

  if (action.type === 'composer.settle') {
    return accept({ ...thread, composerStatus: 'ready' })
  }

  if (action.type === 'assistant.append') {
    return accept({
      ...thread,
      composerStatus: 'running',
      messages: [...thread.messages, action.message],
    })
  }

  if (action.type === 'approval.decide') {
    const approval = approvalById(thread, action.id)
    if (!approval) return reject(thread, `No approval named ${action.id}.`)
    if (approval.status !== 'pending') return reject(thread, 'This decision already has a receipt.')
    const next = mapParts(thread, (part) => {
      if (part.type === 'approval' && part.id === action.id) {
        return { ...part, status: action.decision }
      }
      if (part.type === 'tool' && part.approvalId === action.id && part.status === 'pending') {
        if (action.decision === 'approved') return { ...part, status: 'running' }
        return {
          ...part,
          status: 'failed',
          output: part.output || 'A person rejected this action.',
        }
      }
      return part
    })
    return accept(next)
  }

  if (action.type === 'tool.finish') {
    const tool = toolById(thread, action.id)
    if (!tool) return reject(thread, `No tool named ${action.id}.`)
    if (tool.status === 'succeeded' || tool.status === 'failed') {
      return reject(thread, 'This tool already finished.')
    }
    if (tool.approvalId) {
      const approval = approvalById(thread, tool.approvalId)
      if (!approval || approval.status !== 'approved') {
        return reject(thread, 'This tool is waiting for approval.')
      }
    }
    const next = mapParts(thread, (part) =>
      part.type === 'tool' && part.id === action.id
        ? { ...part, status: action.status, output: action.output ?? part.output }
        : part
    )
    return accept(next)
  }

  return reject(thread, 'Unsupported action.')
}
