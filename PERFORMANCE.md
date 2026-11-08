# Timkit 性能基线

## 双原则（不可妥协）

**性能**与**易用**同等优先级。不允许「为了小包删掉 API」或「为了省事把模板打进主包」。正确做法是：懒加载 chunk、memo 边界、子路径导出、清晰的默认行为与错误提示。

| 易用（默认） | 性能（可选加速） |
| ------------ | ---------------- |
| `import { TimkitAgent, validateAgentThread } from '@timui/agent'` | 主包仍 ≤52KB，thread/recipe 按需加载 |
| `timkit agent validate` 默认含语法检查 | `--no-syntax` / `checkSyntax: false` 用于批量或 CI 热路径 |
| `AgentThreadView` + `reduceAgentThread` 全量 JSON 模型 | 外层虚拟列表；流式只改最后一条 message 的 text part |
| 契约与 CLI 行为一致 | `/agent/*.json` 长缓存 + gzip/brotli |

## 原则

1. **数据层要轻**：`@timui/core/agent-thread` 零运行时依赖，只做纯 reducer。
2. **校验要分层**：热路径用 `validateComponent(..., { checkSyntax: false })`；CLI `--fix` 再开 TypeScript。
3. **UI 要少重渲染**：`AgentThreadView` 按 message/part memo；`useAgentThreadController` 提供稳定 `dispatch`。
4. **线上要可缓存**：`/agent/*`、`/llms.txt`、`/r/*` 走 CDN，文档 Route Handler 使用长 `stale-while-revalidate`。
5. **体积有预算**：CI 跑 `pnpm goal:perf` 与 `pnpm goal:perf:agent`，超预算即失败。

## 本地门禁

```bash
pnpm goal:perf          # 四端组件 gzip payload 估算
pnpm goal:perf:agent    # @timui/agent 包 + React Agent UI 源码
pnpm --filter @timui/docs build
```

## Agent 运行时建议

| 场景         | 做法                                                               |
| ------------ | ------------------------------------------------------------------ |
| 流式打字     | 只更新最后一条 assistant message 的 text part，不要重建整个 thread |
| 工具轮询     | 改 tool part 的 `status/output`，不要 append 新 message            |
| 校验用户代码 | 默认 `checkSyntax: false`，保存或提交前再开 TS                     |
| 长线程       | 虚拟列表包在 `AgentThreadView` 外层，reducer 仍保持全量 JSON       |

## 阿里云 / Nginx 部署清单

- 开启 **gzip + brotli**（JSON 路由收益最大）
- `/r/*.json`、`/agent/*.json`、`/registry-index.json`：`Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- Next.js `output: 'standalone'` 或 PM2 cluster，Node 20+
- 静态资源走 OSS/CDN，HTML 回源 ECS
- 监控：TTFB < 200ms（国内）、LCP < 2.5s（文档首页）

## 当前预算（可在 `scripts/goal-agent-perf-report.ts` 调整）

- `@timui/agent` 主入口 `index.mjs` ≤ 52KB（recipe / thread-coach 为按需 `require` 的独立 chunk）
- `@timui/agent` recipes / thread-coach chunk 分别 ≤ 7.5KB / 9KB
- `@timui/core/agent-thread.ts` ≤ 12KB
- `@timui/react/src/agent/**` 合计 ≤ 28KB
- 单个 agent 组件源文件 ≤ 4.5KB
