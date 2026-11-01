export interface AgentUiComponent {
  name: string
  importFrom: string
  summary: string
  statuses: string[]
  designNotes: string[]
}

export const agentUiCatalog: AgentUiComponent[] = [
  {
    name: 'AgentMessage',
    importFrom: '@timui/react/agent',
    summary: 'One turn in a thread. Role and streaming state are visible as text, not only color.',
    statuses: ['idle', 'streaming', 'error'],
    designNotes: [
      'Keep transport outside the component. Pass role, status, and children.',
      'User, assistant, and system are separate readings of the same component.',
    ],
  },
  {
    name: 'AgentComposer',
    importFrom: '@timui/react/agent',
    summary:
      'The prompt field. Enter sends. Shift+Enter inserts a newline. Empty text cannot send.',
    statuses: ['ready', 'running'],
    designNotes: [
      'Disable sending while the agent is running and say so on the button.',
      'The send control is at least 44px.',
    ],
  },
  {
    name: 'AgentPlan',
    importFrom: '@timui/react/agent',
    summary: 'The ordered steps the agent is working through.',
    statuses: ['pending', 'running', 'done', 'failed'],
    designNotes: ['Every step has a text status. Do not use a spinner as the only signal.'],
  },
  {
    name: 'ToolCall',
    importFrom: '@timui/react/agent',
    summary: 'One tool invocation: name, status, a short input, and the result.',
    statuses: ['pending', 'running', 'succeeded', 'failed'],
    designNotes: [
      'Show a summary instead of dumping raw JSON into the thread.',
      'The tool name stays visible after the call finishes.',
    ],
  },
  {
    name: 'ApprovalCard',
    importFrom: '@timui/react/agent',
    summary: 'A human decision the agent must wait for, plus a receipt after the choice.',
    statuses: ['pending', 'approved', 'rejected'],
    designNotes: [
      'Do not continue a destructive action while status is pending.',
      'After the choice, replace the buttons with a receipt.',
    ],
  },
  {
    name: 'CitationList',
    importFrom: '@timui/react/agent',
    summary: 'The sources behind an answer. Each item is a titled link.',
    statuses: [],
    designNotes: ['Do not hide sources inside unmarked markdown when the answer depends on them.'],
  },
]

export const listAgentUi = () => agentUiCatalog
