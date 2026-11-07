import type { FrameworkId } from './intent'
import type { UsageIssue } from './usage'

type TypeScriptModule = typeof import('typescript')

let typescriptModule: TypeScriptModule | null = null

const loadTypeScript = (): TypeScriptModule | null => {
  if (typescriptModule) return typescriptModule
  try {
    // Lazy load keeps hot validation paths small when syntax checks are disabled.
    typescriptModule = require('typescript') as TypeScriptModule
    return typescriptModule
  } catch {
    return null
  }
}

export const syntaxIssues = (
  code: string,
  framework: FrameworkId,
  enabled = true
): UsageIssue[] => {
  if (!enabled || framework !== 'react' || !code.trim()) return []

  const ts = loadTypeScript()
  if (!ts) return []

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
