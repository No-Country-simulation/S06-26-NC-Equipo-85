## ADDED Requirements

### Requirement: Turborepo workspace structure

The project SHALL have a monorepo organized with 3 internal packages (`ui`, `config`, `env`) and 1 app (`web`). The workspace SHALL use pnpm as the package manager with version 11.5.2+.

#### Scenario: Initialize workspace
- **WHEN** `pnpm install` is run at project root
- **THEN** all 4 packages are installed, and root has `pnpm-workspace.yaml` with all paths

#### Scenario: Workspace commands work
- **WHEN** running `pnpm dev` at root
- **THEN** all packages that define `dev` script run in parallel (e.g., web dev server)

### Requirement: ESLint, Prettier, TypeScript in packages/config

The project SHALL have a shared `packages/config` package that exports ESLint, Prettier, and TypeScript configurations. `apps/web` SHALL import these configs instead of maintaining its own.

#### Scenario: ESLint is centralized
- **WHEN** `apps/web/eslint.config.mjs` imports from `@app/config/eslint`
- **THEN** linting rules are enforced from a single source

#### Scenario: Prettier is centralized
- **WHEN** running `pnpm format` at root
- **THEN** Prettier rules from `packages/config/prettier.config.mjs` apply to entire monorepo

#### Scenario: TypeScript is centralized
- **WHEN** `apps/web/tsconfig.json` extends from `packages/config/tsconfig.base.json`
- **THEN** compiler options are shared and override-able per workspace

### Requirement: Turbo pipeline with caching

The project's `turbo.json` SHALL define a pipeline with `build`, `lint`, `type-check` tasks and remote caching configured.

#### Scenario: Build task has dependencies
- **WHEN** running `turbo build`
- **THEN** tasks run in dependency order (dependencies build first)

#### Scenario: Caching is active
- **WHEN** running the same Turbo task twice without changes
- **THEN** second run uses cache (no rebuild)

### Requirement: packages/env for environment validation

A `packages/env` package SHALL exist to export validated environment schemas. `apps/web` SHALL use this to validate `process.env` at build time.

#### Scenario: Env vars are validated at build
- **WHEN** building the project with invalid env vars
- **THEN** build fails with clear error before running Next.js

#### Scenario: Missing required env vars are caught
- **WHEN** `NEXT_PUBLIC_API_URL` is undefined and required
- **THEN** build fails with error message indicating which var is missing
