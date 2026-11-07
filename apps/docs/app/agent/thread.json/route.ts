import { NextResponse } from 'next/server'
import { agentThreadProtocol } from '@timui/agent'

export const runtime = 'nodejs'

export function GET() {
  return NextResponse.json(
    {
      ...agentThreadProtocol,
      seeds: {
        empty: 'createAgentThread()',
        'refund-support': 'seedAgentThread("refund-support")',
      },
      workflow: [
        'Author or receive an AgentThread as JSON.',
        'validateAgentThread(thread) before rendering.',
        'Render with AgentThreadView and apply actions through reduceAgentThread.',
        'suggestAgentThreadNext(thread) when the agent is unsure what to do next.',
      ],
      example: {
        userAction: { type: 'approval.decide', id: 'refund-approval', decision: 'approved' },
        backendAction: {
          type: 'tool.finish',
          id: 'refund',
          status: 'succeeded',
          output: 'Refund sent.',
        },
      },
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  )
}
