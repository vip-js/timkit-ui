# 微信小程序组件支持

Timkit UI 现在提供一套与 Web 组件同源的「小程序渲染层」。所有组件的**交互逻辑**都由 `packages/core` 中的 Zag.js 状态机驱动，并通过 `createWeappMachine` 适配器连接到小程序组件。Web 端继续使用 React + Tailwind，微信小程序端则输出 `.wxml + .wxss + .ts` 自定义组件。

## 前置要求

- 微信开发者工具（基础库 ≥ 2.31），项目允许自定义组件。
- 运行 `pnpm tokens:build` 生成 `packages/tokens/dist/theme.wxss`。
- 在小程序根目录的 `app.wxss` 或页面层引入 `theme.wxss` 与组件 wxss。

## 目录结构

```
packages/
  core/schemas           # 平台无关的组件 schema
  tokens                 # 统一的设计变量，生成 web/weapp 主题
  weapp/primitives       # 小程序原子组件实现
```

示例：`packages/weapp/primitives/button` 中包含 Button 的模板、样式、逻辑，并由 `packages/weapp/registry.ts` 汇总，供文档站、CLI 或自动化脚本读取。

## 设计变量

运行下面的指令会把 `packages/tokens/theme.ts` 中的 tokens 序列化为 Web 可用的 `theme.css` 与 WeChat 可用的 `theme.wxss`：

```bash
pnpm tokens:build
```

生成的 CSS 变量会在小程序的 `page` 选择器中注入，因此自定义组件可以直接使用 `var(--color-primary)` 等变量，保持和 Web 一致的色板与圆角。

在小程序项目中引入：

```css
/* app.wxss */
@import 'packages/tokens/dist/theme.wxss';
```

## 新增小程序组件

1. 在 `packages/core` 中定义 State Machine (e.g. `accordion.machine.ts`)。
2. 在 `packages/weapp/primitives` 下创建对应目录，包含：
   - `index.ts`：使用 `createWeappMachine` 初始化状态机，并桥接 props。
   - `*.wxml`：结构模板，绑定 `state.context` 数据。
   - `*.wxss`：样式文件，消费 tokens 变量。
   - `*.ts`：(已废弃，逻辑应在 index.ts 中完成)。
3. 将新组件加入 `packages/weapp/registry.ts`，即可被构建工具及文档检索。

后续可基于 registry 提供 `pnpm dlx timkit add --platform wechat button` 等 CLI 命令，实现跨端一键拉取。

## 常见注意事项

- 单位：尽量使用 `rpx` 适配；tokens 目前输出 `rem`/`px`，如需纯 `rpx` 可在生成器中增加转换。
- 样式隔离：组件 wxss 默认 `addGlobalClass: true`，如需完全隔离可调整 options。
- 事件命名：保持与 Web schema 一致（如 `onPress` → `bindpress`），避免歧义。
- 版本对齐：发布时将 Web/Weapp 组件与 tokens 同步版本号，防止 tokens 缺字段导致渲染异常。
