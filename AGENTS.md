# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in the Timkit UI monorepo.

## Build Commands

### Commands from Root

- `pnpm build` - Build all packages using Turbo
- `pnpm dev` - Start development mode for all packages
- `pnpm lint` - Run ESLint across all packages
- `pnpm typecheck` - Run TypeScript type checking for all packages
- `pnpm test` - Run tests across all packages
- `pnpm format` - Format code with Prettier

### Package-Specific Commands

- `pnpm --filter @timui/react run lint` - Lint React package
- `pnpm --filter @timui/core run lint` - Lint core package
- `pnpm --filter @timui/vue run lint` - Lint Vue package
- `pnpm --filter @timui/react run typecheck` - Type check React package
- `pnpm --filter @timui/core run test` - Run core package tests (using Vitest)

### Running Single Tests

A registry parity test currently exists at `tests/core-multiplatform.spec.ts`. As more tests are added:

- Use `vitest run` from individual package directories
- For core package: `pnpm --filter @timui/core run test <test-file>`
- Use Vitest CLI commands for specific test filtering

## Code Style Guidelines

### Import Organization

Follow the defined import order from `.prettierrc.mjs`:

1. React and Next.js imports
2. Third-party modules (alphabetical)
3. Empty line
4. Type imports (`types`)
5. Internal path aliases (`@/types`, `@/config`, `@/lib`, etc.)
6. Component imports (`@/components/ui`, `@/components`)
7. App-specific imports
8. Empty line
9. Relative imports

### TypeScript Configuration

- Strict mode enabled (`"strict": true`)
- No implicit any (`"noImplicitAny": true`)
- ESNext target and module
- React JSX transform (`"jsx": "react-jsx"`)
- Path aliases: `@timui/*` maps to `./packages/*/src`

### Component Structure

- Use React.forwardRef for components that accept refs
- Follow the pattern: Props interface → Type guard → Component implementation
- Export both components and variant functions (e.g., `Button, buttonVariants`)
- Use `data-slot` attribute for component identification

### Naming Conventions

- Component files: PascalCase (e.g., `Button.tsx`, `DatePicker.tsx`)
- Hook files: camelCase with `use-` prefix (e.g., `useMachine.ts`, `useToast.ts`)
- Export interfaces and types using `export type`
- Use descriptive prop names (`onPress` not `onClick`, `asChild` for polymorphism)

### Styling and Variants

- Use `class-variance-authority` (CVA) for component variants
- Utility function `cn()` for className merging (from `@timui/core`)
- Tailwind CSS v4 with design tokens
- Component variants defined in core package schemas

### Error Handling

- TypeScript strict mode prevents many runtime errors
- Use type guards (`AssertNoExtraKeys`) for prop validation
- Zod schemas for complex data validation in core package

### Framework-Specific Guidelines

- React components use React Aria Components and Zag.js adapters
- Forward refs properly for DOM elements
- Use `asChild` pattern for composition
- Handle both `onClick` and `onPress` events consistently

## Package Structure

### Core Package (`@timui/core`)

- Contains all Zag.js state machines
- Defines component schemas and TypeScript interfaces
- Shared utilities and styling system
- Tailwind preset and theme engine

### Framework Packages

- `@timui/react`: React components with custom hooks
- `@timui/vue`: Vue components with Zag adapters
- `@timui/weapp`: WeChat mini-program components
- `@timui/html`: Vanilla HTML components

### CLI Package (`@timui/cli`)

- Component installation and project initialization
- Registry synchronization tools
- Build and release automation scripts

## Development Workflow

1. Make changes to core logic first, then framework implementations
2. Run `pnpm typecheck` before committing
3. Use `pnpm lint` to ensure code quality
4. Format code with `pnpm format` before commits
5. Test changes across supported frameworks when applicable

## Registry Pattern

Components are maintained in `apps/docs/registry/` following the shadcn/ui pattern:

- Source code is distributed, not compiled
- Users can copy-paste and modify components freely
- CLI tools available for component installation: `npx timkit add <component>`

## Testing

- Vitest is the test runner
- Test files should follow `*.test.ts` or `*.spec.ts` naming
- Tests should be co-located with source files in packages
- Coverage output goes to `coverage/` directories

## Build System

- Turbo for monorepo task orchestration
- tsup for package bundling (CJS/ESM dual output)
- Tailwind CSS v4 for styling
- TypeScript compilation with strict settings

## 多端架构决策（Mobile & Cross-Platform Architecture）

### 平台分层原则

所有端从 `@timui/core` 获取 variant 函数、Props 类型和 TimEvent 协议，保持单一真相源。

| 平台         | 包             | 策略                                            |
| ------------ | -------------- | ----------------------------------------------- |
| Web React    | `@timui/react` | 响应式 CSS + mobile-first utilities             |
| Web Vue      | `@timui/vue`   | 响应式 CSS + mobile-first utilities             |
| 微信小程序   | `@timui/weapp` | 独立实现，环境差异太大（无 DOM / setData 模型） |
| 静态 HTML    | `@timui/html`  | 代码片段/复制模板，无 JS 运行时                 |
| React Native | _(未来)_       | 预留 `FrameworkId: 'react-native'`              |

### 移动端 Web 策略（方案 B）

- **简单组件**（Button、Badge、Input 等）：响应式 CSS 一套搞定，使用 `@media (hover: none) and (pointer: coarse)` 做触摸优化
- **重交互组件**（DatePicker、Select、Dialog 等）：在 `packages/react/src/components/mobile/` 和 `packages/vue/src/components/mobile/` 下提供特化版本（BottomSheet、MobilePicker 等）
- **Safe Area** tokens：使用 `pt-safe-top`, `pb-safe-bottom` 等（来自 `timkitTailwindPreset`）处理 iOS 刘海/Home Bar
- **Touch Target**：使用 `min-h-touch-target`, `min-w-touch-target` 满足 WCAG AAA 44px 最小触摸目标

### WeApp 机器适配器分工

WeApp 包内有两个机器适配文件，分工明确：

- **`utils/machine.ts`** → 与 `@zag-js/core` 官方 `Machine` 集成，用于有完整状态机的组件（Switch、Accordion 等）
- **`utils/machine-adapter.ts`** → 自研轻量适配器，用于无复杂状态机的简单组件（Button、Badge 等）

### 跨端事件协议（TimEvent）

所有端的交互事件必须触发 `TimEvent`（通过 `createTimEvent()` 生成）：

```ts
// React / Vue
onPress?.(createTimEvent('press', buttonId, {}))

// WeApp
this.triggerEvent('press', createTimEvent('press', buttonId, {}) as unknown as object)
```

WeApp 同时触发 `tap`（原生约定）和 `press`（TimEvent 协议），两者并存。
