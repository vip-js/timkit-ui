# Timkit Agent 创新方向

## 我们在赌什么

大多数 Agent UI 库仍然把「聊天框 + 若干卡片」当作终点。Timkit 把 **线程数据** 当作第一公民：模型和应用只交换 `AgentThread` 和 `AgentUiAction`，界面是 reducer 的投影，而不是另一套手写 JSX。

这和 CopilotKit 的 generative UI、assistant-ui 的 composable thread、tool-ui 的 schema 化工具展示是同一条进化线，但 Timkit 更激进：**门闩写进 reducer**，审批不回滚，工具不能绕过人。

## 已经落地的差异化

| 能力                                | 为什么重要                                                     |
| ----------------------------------- | -------------------------------------------------------------- |
| `AgentThread` + `reduceAgentThread` | Agent 读写的不是页面，而是可版本化、可测试的状态机             |
| `approvalId` 门闩                   | 破坏性工具在 reducer 层被挡住，而不是靠提示词祈祷              |
| `/agent/thread.json`                | 协议对外公开，模型不必从源码反推                               |
| `validateAgentThread`               | 生成错 JSON 时先自检，再渲染                                   |
| `suggestAgentThreadNext`            | 告诉编码 Agent「现在该等人、该跑工具、还是该 append 助手回合」 |
| `@timui/react/agent`                | 业务组件只接收 props，传输层留在应用里                         |

## 下一波创新（按优先级）

### 1. 审计与回放

把每次 `reduceAgentThread` 的结果追加到 append-only log（谁批准、何时 tool.finish）。客服与金融场景需要 **不可篡改的回执链**，而不只是 UI 上的 “Receipt: Approved”。

### 2. 多 Agent 接力

在 `AgentThreadMessage` 上增加 `agentId` / `handoffTo`，支持「检索 Agent → 执行 Agent → 审核 Agent」在同一条线程里可见。UI 用 `system` 消息 + `AgentPlan` 表达交接，而不是开新聊天窗口。

### 3. 部件注册表（Generative UI Registry）

像 tool-ui 一样，为 `type: "order-summary" | "geo-map"` 等扩展 part 注册 Zod schema + React 渲染器。核心 reducer 只认 `text/plan/tool/approval/citations`；扩展 part 由应用注册，Timkit 提供协议壳。

### 4. Vue / 小程序 Agent 层

React 已有 `AgentThreadView`；Vue 3 用同一 `AgentThread` JSON 渲染 SFC 套件，小程序用 WXML 模板 + 相同 action 协议，保证 **一份线程，多端投影**。

### 5. 与预览协议统一

扩展 `@timui/core/preview-protocol`：iframe 里 `LOAD_AGENT_THREAD` 加载 JSON，文档站可交互演示审批门闩，无需启动完整后端。

### 6. 从自然语言到线程 seed

`timkit agent thread synthesize "<prompt>"`：不是生成整页 JSX，而是生成 **合法 AgentThread JSON**（含 plan、tool、approval 占位），再交给 `validateAgentThread` 修正。

## 设计原则（给所有贡献者）

1. **数据先于组件**：先问「Agent 该写什么 JSON」，再问「用什么 React 画出来」。
2. **门闩先于文案**：安全规则在 reducer 里 enforce，不要只写在 `llms.txt`。
3. **可拒绝、可解释**：每次 reject 带 `reason`，方便模型自我修正。
4. **Receipt 不可覆盖**：人的决定是事件，不是可编辑字段。
5. **传输在外、状态在内**：SSE/WebSocket/AG-UI 适配器不属于组件库。

## 对标但不复制

- **assistant-ui**：学 Thread/Message/Composer 分层，不学托管 runtime。
- **CopilotKit**：学 generative UI 与 shared state 产品形态，Timkit 保持 registry-first、可拷贝源码。
- **tool-ui**：学 Zod + copy-paste 部件，Timkit 把 schema 挂在 `AgentPart` 扩展点上。
- **Vercel AI SDK**：学 headless 传输，Timkit 的 `@timui/react/agent` 是 presentation，不是 transport。

## 成功标准

一个从未看过 Timkit 源码的编码 Agent，只读 `/llms.txt`、`/agent/thread.json` 和 `/agent/{name}.json`，就能：

1. 规划要装哪些 registry 项；
2. 生成或接收合法 `AgentThread`；
3. 渲染 `AgentThreadView`；
4. 在审批通过前不调用破坏性 `tool.finish`；
5. 用 `validate` / `suggest` 自修复结构错误。

达到这五条，才算「Agent 时代最好用」的组件库，而不是「带 AI 皮肤的 shadcn」。
