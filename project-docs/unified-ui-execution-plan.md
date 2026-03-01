# Timkit Unified Multi-Platform Execution Plan

## Goal

Cover shadcn/ui capability while providing a unified architecture across React, Vue, WeApp, and HTML with source-first, high-performance components.

## Current Gaps

1. Contract drift between `schema.ts`, `props.ts`, and `variants.ts` in some core components.
2. Runtime inconsistency across frameworks for the same component (some paths use Zag machines, others use local state logic).
3. CLI setup rules and doctor checks are not fully aligned for Tailwind v4 workflows.
4. Quality gates focus on parity presence but not enough on architecture consistency and contract integrity.
5. Migration traces (`any`, temporary comments, workaround code) remain in some hot components.

## Baseline Snapshot

Source: `pnpm goal:gap` (latest local run)

- Core components: 50
- Full 4-platform coverage: 29 / 50
- Findings: critical=3, major=19, minor=1
- Current critical items:
  - `checkbox-tree` (coverage gap)
  - `datefield` (coverage gap)
  - `image-cropper` (coverage gap)

## Delivery Phases

### Phase 1: Baseline Guardrails (Week 1)

1. Add `goal:gap` auditing command to quantify:
   - framework coverage per core component
   - schema/props/variants contract drift
   - code-quality risk markers (`any`, `TODO`, `FIXME`)
2. Fix high-confidence contract drift issues (starting with `button`).
3. Align CLI doctor checks with init outputs for Tailwind v4.
4. Update developer docs to reflect real test status.

Definition of done:
- `pnpm goal:gap` exists and runs in CI/local.
- No critical contract drift for baseline components.

### Phase 2: Unified Runtime Contract (Week 2-4)

1. Establish per-component runtime strategy matrix:
   - `zag-machine` (preferred for interactive atoms)
   - `stateless primitive` (display-only)
   - `adapter` (platform-specific bridge with shared event contract)
2. Migrate inconsistent components to agreed strategy:
   - priority: `select`, `dialog`, `avatar`, `progress`
3. Add contract tests asserting event payload and controlled/uncontrolled behavior parity across frameworks.

Definition of done:
- Strategy declared for all core components.
- Priority components pass parity behavior tests across frameworks.

### Phase 3: Source Distribution Hardening (Week 4-6)

1. Normalize registry transformation rules so copied source is self-sufficient and deterministic.
2. Audit and remove temporary migration comments and broad `any` usage in exported components.
3. Add canary app fixtures for each framework to validate `timkit init + timkit add` end-to-end.

Definition of done:
- Fresh scaffold and add flows pass in all framework canaries.
- No blocker-level migration traces in exported public components.

### Phase 4: Performance and UX Tuning (Week 6+)

1. Introduce performance budgets:
   - render cost benchmarks for interactive atoms
   - bundle-size budget per package
2. Improve docs and examples for multi-end rapid interaction scenarios.
3. Add release gates for parity + performance + API compatibility.

Definition of done:
- Regressions are blocked by budget thresholds.
- Multi-end starter templates are production-ready.

## Priority Backlog

1. P0: Contract drift checker + baseline fixes.
2. P0: Runtime strategy and migration for `select`.
3. P1: Cross-framework event contract tests.
4. P1: Registry transform stabilization.
5. P2: Performance benchmarking and docs refinement.
