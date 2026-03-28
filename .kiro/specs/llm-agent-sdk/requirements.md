# Requirements Document: LLM Agent SDK

## Introduction

The LLM Agent SDK enhances the Timkit UI component library to enable seamless LLM interaction. The core goal is to make it effortless for LLMs to understand, use, and generate code with Timkit components.

### Current Pain Points for LLMs

1. **Limited metadata** - Registry only has basic info (name, type, files), missing props, variants, examples
2. **No usage guidance** - LLMs don't know common patterns, best practices, or gotchas
3. **Manual error fixing** - When LLMs generate incorrect code, they need multiple iterations to fix
4. **No context awareness** - LLMs can't easily discover what's already installed or what dependencies are needed

### Solution: Enhance CLI with LLM-Friendly Features

Integrate into `@timui/cli` package:

1. **Rich Metadata API** - Expose detailed component information (props, variants, examples, patterns)
2. **Smart Code Snippets** - Provide ready-to-use code templates for common scenarios
3. **Validation & Auto-Fix** - Validate generated code and suggest/apply fixes automatically
4. **Context Awareness** - Track project state so LLMs can make informed decisions

The focus is on **making LLMs productive** - reducing iterations, providing clear guidance, and enabling self-correction.

## Glossary

- **CLI_Package**: The `@timui/cli` package that will be enhanced with LLM-friendly features
- **Registry**: The component source code repository in `apps/docs/registry/` and its JSON metadata
- **Component_Metadata**: Extended information about components (props, variants, examples, patterns)
- **Framework_Target**: One of: react, vue, svelte, html, weapp
- **Zag_Machine**: State machine from @zag-js library used for component logic
- **Code_Snippet**: Ready-to-use code template for a specific use case
- **LLM_Guide**: Machine-readable documentation optimized for LLM consumption

## Requirements

### Requirement 1: Enhanced Component Metadata

**User Story:** As an LLM, I want to access rich component metadata including props, variants, usage examples, and common patterns, so that I can understand how to use each component correctly on the first try.

#### Acceptance Criteria

1. WHEN an LLM queries component metadata, THE CLI_Package SHALL provide structured information including: component name, description, category, props with types and defaults, available variants, Zag_Machine usage (if applicable), framework availability, and accessibility requirements
2. THE metadata SHALL include at least 3 usage examples per component showing: basic usage, common variants, and advanced patterns
3. FOR EACH prop, THE metadata SHALL specify: name, TypeScript type, default value, description, whether it's required, and example values
4. FOR EACH variant, THE metadata SHALL specify: variant name, available options, default option, and visual description
5. WHERE a component uses a Zag_Machine, THE metadata SHALL include: machine name, key props that map to machine context, state management pattern, and API methods
6. THE metadata SHALL include common pitfalls and gotchas (e.g., "must use within form", "requires forwardRef", "needs Context provider")
7. THE metadata SHALL be available via CLI command (`timkit info <component> --json`) outputting structured JSON
8. THE metadata SHALL include related components and common composition patterns

### Requirement 2: Code Snippet Library

**User Story:** As an LLM, I want access to pre-validated code snippets for common use cases, so that I can generate correct code without trial and error.

#### Acceptance Criteria

1. THE CLI_Package SHALL provide code snippets for each component covering: basic usage, all major variant combinations, composition with other components, and form integration patterns
2. WHEN an LLM requests a code snippet via `timkit snippet <component> <pattern> --framework <target>`, THE CLI_Package SHALL return framework-specific code with proper imports, type annotations, and inline comments
3. THE snippets SHALL follow all conventions from AGENTS.md including: import organization, naming conventions, forwardRef usage, and data-slot attributes
4. FOR components with Zag_Machine, THE snippets SHALL include: complete machine setup, API connection, context provider pattern, and proper prop binding with mergeProps
5. THE snippets SHALL include inline comments explaining: key concepts, customization points, and common modifications
6. THE CLI_Package SHALL support snippet categories: "basic", "variants", "composition", "forms", "advanced"
7. THE snippets SHALL be stored in `packages/cli/src/snippets/` organized by component and framework

### Requirement 3: Intelligent Code Validation and Auto-Fix

**User Story:** As an LLM, I want automatic validation and fixing of generated code, so that I can self-correct common mistakes without multiple iterations.

#### Acceptance Criteria

1. THE CLI_Package SHALL provide `timkit validate <file>` command that checks code against: TypeScript types, ESLint rules, import organization, Timkit conventions, and accessibility requirements
2. THE CLI_Package SHALL automatically fix common issues including: missing imports, incorrect import order, missing forwardRef, missing data-slot attributes, incorrect Zag_Machine patterns, and missing ARIA attributes
3. WHEN validation fails, THE CLI_Package SHALL return structured JSON with: error type, severity, line number, column, description, and suggested fix code
4. THE CLI_Package SHALL provide `timkit validate <file> --fix` flag that applies auto-fixes and outputs a diff
5. THE auto-fix engine SHALL preserve code semantics and only modify style, imports, and convention issues
6. THE validation SHALL check Zag_Machine usage patterns: proper useMachine call, correct connect function usage, and proper mergeProps usage
7. WHERE auto-fix is not possible, THE CLI_Package SHALL provide actionable suggestions with example code snippets
8. THE validation output SHALL be LLM-friendly with clear error messages and fix instructions

### Requirement 4: Project Context Awareness

**User Story:** As an LLM, I want to understand the current project state including installed components and dependencies, so that I can make informed decisions about what to add or modify.

#### Acceptance Criteria

1. THE CLI_Package SHALL provide `timkit context` command that outputs JSON with: installed components, detected Framework_Target, Tailwind version, dependency graph, and component usage statistics
2. THE CLI_Package SHALL maintain `.timkit/context.json` file that is automatically updated when components are added or removed
3. THE CLI_Package SHALL detect Framework_Target by checking: package.json dependencies, framework config files (vite.config, next.config), and existing component imports
4. WHEN an LLM queries dependencies via `timkit deps <component>`, THE CLI_Package SHALL return: direct dependencies, transitive dependencies, and reverse dependencies (what depends on this component)
5. THE CLI_Package SHALL track which components are actually used in the codebase by scanning import statements
6. THE context SHALL include warnings for: unused installed components, missing dependencies, and version mismatches
7. THE CLI_Package SHALL provide `timkit context --refresh` to rescan the project and update context

### Requirement 5: LLM-Optimized Documentation

**User Story:** As an LLM, I want documentation in a structured, machine-readable format with clear patterns and examples, so that I can quickly understand how to use components correctly.

#### Acceptance Criteria

1. THE CLI_Package SHALL generate `llm-guide.json` containing comprehensive component documentation in structured format
2. THE documentation SHALL include for each component: overview, when to use, props reference, variants reference, code examples (3+ per framework), common patterns, gotchas, and accessibility notes
3. THE CLI_Package SHALL provide `timkit docs generate` command that creates/updates the LLM guide from Registry data and code analysis
4. THE documentation SHALL use consistent schema with required fields validated by Zod
5. THE CLI_Package SHALL support querying specific sections via `timkit docs <component> <section>` (e.g., `timkit docs button examples --framework react`)
6. THE documentation SHALL include cross-references showing: related components, common compositions, and alternative components
7. THE LLM guide SHALL be versioned and include metadata about Timkit UI version and last update timestamp

## Correctness Properties

### Property 1: Metadata Completeness

**Property:** For all components in the Registry, the enhanced metadata SHALL include all required fields (name, description, props, variants, examples, patterns).

**Test Strategy:** Property-based test that iterates through all registry items and validates metadata schema completeness.

### Property 2: Code Snippet Validity

**Property:** For all code snippets, the generated code SHALL pass TypeScript compilation and ESLint validation without errors.

**Test Strategy:** Property-based test that generates code from all snippets and validates them using the validation engine.

### Property 3: Auto-Fix Idempotence

**Property:** For all valid code, applying auto-fix twice SHALL produce the same result as applying it once (idempotent operation).

**Test Strategy:** Property-based test that applies auto-fix repeatedly and checks for convergence.

### Property 4: Context Consistency

**Property:** The project context SHALL always reflect the actual state of installed components in the filesystem.

**Test Strategy:** Property-based test that compares context.json with actual filesystem state and import usage.

### Property 5: Framework-Specific Correctness

**Property:** For all Framework_Target values, generated code SHALL follow framework-specific conventions and patterns defined in AGENTS.md.

**Test Strategy:** Property-based test that validates generated code against framework-specific rules for each target.

