import ts from 'typescript'

import type { FrameworkId } from './intent'
import type { UsageIssue } from './usage'

export const syntaxIssues = (code: string, framework: FrameworkId): UsageIssue[] => {
  if (framework !== 'react' || !code.trim()) return []

  const result = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      strict: true,
    },
    reportDiagnostics: true,
    fileName: 'snippet.tsx',
  })

  return (result.diagnostics || [])
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map((diagnostic) => ({
      type: 'syntax' as const,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      line:
        typeof diagnostic.start === 'number'
          ? code.slice(0, diagnostic.start).split('\n').length
          : undefined,
    }))
}
