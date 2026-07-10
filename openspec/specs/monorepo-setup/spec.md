# monorepo-setup Specification

## Purpose

Establish a Turborepo + pnpm workspace with shared internal packages so configuration, environment validation, and (eventually) UI components are reused across apps instead of duplicated.

## Requirements

### Requirement: Turborepo workspace structure

The project SHALL have a monorepo organized with internal packages under `packages/` (`config`, `env`; `ui` reserved for Fase 1) and 1 app (`apps/web`). The workspace SHALL use pnpm as the package manager with version 11.5.2+.

#### Scenario: Initialize workspace
- **WHEN** `pnpm install` is run at project root
- **THEN** all workspace packages are installed, and root has `pnpm-workspace.yaml` listing `apps/*` and `packages/*`

#### Scenario: Workspace commands work
- **WHEN** running `pnpm dev` at root
- **THEN** all packages that define `dev` script run via turbo (e.g., web dev server)

### Requirement: ESLint, Prettier, TypeScript in packages/config

The project SHALL have a shared `packages/config` package (`@app/config`) that exports ESLint, Prettier, and TypeScript configurations. `apps/web` SHALL consume these configs instead of maintaining its own.

#### Scenario: ESLint is centralized
- **WHEN** `apps/web/eslint.config.mjs` imports from `@app/config/eslint`
- **THEN** linting rules are enforced from a single source

#### Scenario: Prettier is centralized
- **WHEN** running `pnpm format` at root
- **THEN** Prettier rules from `packages/config/prettier.config.mjs` apply to the monorepo

#### Scenario: TypeScript is centralized
- **WHEN** `apps/web/tsconfig.json` extends `@app/config/tsconfig`
- **THEN** compiler options are shared and override-able per workspace

### Requirement: Turbo pipeline with caching

The project's `turbo.json` SHALL define a pipeline with `build`, `lint`, `type-check` tasks with caching.

#### Scenario: Build task has dependencies
- **WHEN** running `turbo build`
- **THEN** tasks run in dependency order (`^build` first)

#### Scenario: Caching is active
- **WHEN** running the same Turbo task twice without changes
- **THEN** the second run uses cache (no rebuild)

### Requirement: packages/env for environment validation

A `packages/env` package (`@app/env`) SHALL export validated environment schemas using `@t3-oss/env-nextjs` + Zod. `apps/web` SHALL import it so `process.env` is validated at build time.

#### Scenario: Env vars are validated at build
- **WHEN** building the project with invalid env vars (and validation not skipped)
- **THEN** the build fails with a clear error before running Next.js

#### Scenario: Validation can be skipped for Docker build
- **WHEN** `SKIP_ENV_VALIDATION=1` is set (e.g., in the Docker builder stage)
- **THEN** env validation is bypassed and the build proceeds
