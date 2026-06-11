# monorepo-setup Specification (delta)

> Fase 1 adds `packages/ui` as the third internal package.

## MODIFIED Requirements

### Requirement: Turborepo workspace structure

The project SHALL have a monorepo organized with internal packages under `packages/` (`config`, `env`, `ui`) and 1 app (`apps/web`). The workspace SHALL use pnpm as the package manager with version 11.5.2+.

#### Scenario: Initialize workspace
- **WHEN** `pnpm install` is run at project root
- **THEN** all workspace packages are installed (including `@app/ui`), and root has `pnpm-workspace.yaml` listing `apps/*` and `packages/*`

#### Scenario: Workspace commands work
- **WHEN** running `pnpm dev` at root
- **THEN** all packages that define `dev` script run via turbo (e.g., web dev server)

#### Scenario: UI package is wired into shared tooling
- **WHEN** running `pnpm lint` and `pnpm type-check` at root
- **THEN** `packages/ui` is included, consuming `@app/config` presets like the other workspaces
