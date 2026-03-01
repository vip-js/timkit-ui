# Timkit UI 编码规范（迭代开发版）

## A. 通用规范

- 只做与任务直接相关的最小改动。
- 保持 TypeScript 严格模式兼容，不引入新的隐式 `any`。
- 新逻辑优先写在 core，再做框架适配。
- 不在 framework 层复制 core 中已存在的契约定义。

## B. 导入顺序

遵循 `.prettierrc.mjs`：

1. React/Next
2. 第三方依赖
3. 空行
4. `types`
5. 内部别名（`@/types`、`@/config`、`@/lib`、`@/hooks`...）
6. 组件别名（`@/components/ui`、`@/components`）
7. app/registry/styles
8. 空行
9. 相对路径

## C. 命名与文件组织

- 组件文件：`PascalCase`（React/Vue 文件以仓库既有命名风格为准）。
- hooks：`use-*.ts` 或既有风格兼容命名。
- Core 组件目录固定包含：`index.ts` + `schema.ts` + `props.ts` + `variants.ts`（必要时 `machine.ts`）。

## D. 组件 API 与事件

- 统一使用 `onPress` 作为跨端语义事件，Web 可桥接 `onClick`。
- `asChild` 只用于结构复用，不改变交互契约。
- 受控/非受控 props（如 `value/defaultValue`）需要行为一致。

## E. 样式与结构

- 所有可定位节点使用稳定 `data-slot`。
- 变体由 CVA 控制，不在业务层散落条件 class。
- 不将演示文案硬编码进基础组件。

## F. 质量门禁

- 单包改动：至少通过该包 lint/typecheck。
- 跨包改动：通过根级 `pnpm lint` + `pnpm typecheck`。
- registry 相关改动：执行 `pnpm registry:build:all` 并确认无阻断错误。

## G. PR 检查单

- core 契约是否先行且与 framework 对齐。
- `data-slot` 与语义结构是否跨端一致。
- 导出入口是否补齐（`packages/*/src/index.ts`）。
- 是否运行并记录了必要校验命令。
