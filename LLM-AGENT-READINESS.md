# Timkit UI Agent 接入能力

评测日期：2026-11-01。对象是 `v0.0.4` 上的 `@timui/agent`、`timkit agent` 和文档站契约。

## 设计来源

对照了 assistant-ui、prompt-kit、CopilotKit 和 tool-ui 的公开设计，没有搬它们的实现。吸收的是分层：传输和模型调用留在应用里；界面只接收状态。工具调用展示成有名字和状态的卡片，而不是一段 JSON。会改数据的动作先停在审批卡上，人选完以后留下回执。回答依赖的资料用引用列表单独列出。

## 结论

Agent 可以在不读源码的情况下完成「理解需求 → 选组件 → 安装 → 生成可编译片段 → 自己发现错误」。匹配不到组件时会停下来提问，而不是安装一份无关组件。

校验分两层：TypeScript 编译器报告 React 片段的语法错误；props、导入和可访问性按组件契约检查。`timkit agent validate <file> --fix` 会改写可安全修复的约定问题，并且对同一文件再跑一次不会产生新改动。登录表单、确认对话框和通知开关有 React / Vue 配方，`timkit agent recipe` 直接给出已通过校验的源码。

还没有覆盖的部分：不会替用户的整个工程跑 `tsc`，也不会自动重排业务逻辑。配方之外的新界面，仍然要先读 `/agent/{name}.json`。

## 已经可用

| 能力                                                | 入口                                  |
| --------------------------------------------------- | ------------------------------------- |
| 中英文需求规划，返回 `confidence`                   | `timkit agent plan "<prompt>" --json` |
| 组件契约：props、variants、examples、a11y、pitfalls | `timkit agent inspect <name> --json`  |
| 按框架生成片段                                      | `TimkitAgent.generateComponent`       |
| 枚举值、图标按钮可访问性、错误包导入、TS 语法       | `timkit agent validate <file> --json` |
| 安全修复，重复执行不再改动                          | `timkit agent validate <file> --fix`  |
| 登录、确认框、通知开关、客服 Agent 工作台          | `timkit agent recipe <id> --json`     |
| Agent 业务组件：消息、输入、计划、工具、审批、引用 | `import { ToolCall } from '@timui/react/agent'` |
| 线程数据与审批门闩                                  | `reduceAgentThread` from `@timui/core/agent-thread` |
| 直接依赖、传递依赖、反向依赖                        | `timkit agent deps <name> --json`     |
| 扫描当前项目已安装的 Timkit 组件                    | `timkit agent context --json`         |
| 多轮补充，后一句没点名组件时沿用上一轮              | `createSession().ask()` / `reply()`   |
| 远程组件契约，不含源码正文                          | `/agent/{name}.json`                  |
| 远程发现                                            | `/llms.txt`、`/agent-index.json`      |

安装命令是 `npx timkit add <name> --yes --framework <react|vue|html|weapp>`。`shadcn add <registry url>` 仍可作为替代。

## Agent 必须遵守

1. `confidence` 为 `none` 时不要安装。`low` 时先向用户确认。
2. 只使用 metadata 里出现的枚举值。生成器会丢弃未知 prop，并在 `notes` 里说明。
3. 原语从 `@timui/react` 或 `@timui/vue` 按具名导出引入。区块和页面从安装后的文件做 default import。
4. `size="icon"` 必须带 `aria-label`。
5. 中文可以直接说：按钮、弹窗、输入框、开关、标签页、聊天。

## 还没做

- 用 TypeScript 编译器和 ESLint 做整文件检查，并自动写回修复。
- 为每个组件手写 3 个以上业务场景示例。校验器现在保证片段符合契约，不保证视觉成品。
- 不在项目里写 `.timkit/context.json`。`agent context` 每次扫描 `package.json` 和源码，避免一份过期清单。

## 自测

```bash
pnpm --filter @timui/agent run test
```
