'use client'

import { useCallback, useState } from 'react'
import { reduceAgentThread, type AgentThread, type AgentUiAction } from '@timui/core/agent-thread'

export function useAgentThreadController(initial: AgentThread) {
  const [thread, setThread] = useState(initial)
  const dispatch = useCallback((action: AgentUiAction) => {
    setThread((current) => reduceAgentThread(current, action).thread)
  }, [])
  return { thread, dispatch }
}
