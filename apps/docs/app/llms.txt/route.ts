export const runtime = 'nodejs'

const body = `# Timkit UI

Timkit UI is a mobile-first, agent-native UI registry for React, Vue, HTML, and WeApp.

Primary URLs:
- Homepage: https://ui.timkit.cn
- Registry index: https://ui.timkit.cn/registry-index.json
- Full registry: https://ui.timkit.cn/registry-all.json
- Item shortcut: https://ui.timkit.cn/r/{name}.json
- Agent index: https://ui.timkit.cn/agent-index.json

CLI:
- Inspect agent contract: curl https://ui.timkit.cn/agent-index.json
- Fetch any item: curl https://ui.timkit.cn/r/{name}.json
- Add a React component with shadcn CLI: npx shadcn@latest add https://ui.timkit.cn/r/button.json
- Add a mobile block with shadcn CLI: npx shadcn@latest add https://ui.timkit.cn/r/commerce-home-01.json
- Add a mobile template with shadcn CLI: npx shadcn@latest add https://ui.timkit.cn/r/mobile-marketplace.json

Selection rules for coding agents:
- Prefer registry:page items when the user asks for a complete mobile screen.
- Prefer registry:block items when the user asks for a section or flow fragment.
- Prefer registry:ui items when the user asks for a primitive component.
- Keep touch targets at least 44px high and preserve safe-area padding classes.
- Use the file content from registry item JSON as the source of truth.
`

export function GET() {
  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
