## ADDED Requirements

### Requirement: Docker Compose for development

The project SHALL have a `docker-compose.yml` that spins up the Next.js dev server with hot-reload on file changes. Volume mounts at `/app` SHALL watch source code and rebuild automatically.

#### Scenario: docker compose up starts dev server
- **WHEN** running `docker compose up` from project root
- **THEN** Next.js dev server starts on `http://localhost:3000` inside container and is accessible from host

#### Scenario: Hot-reload works in Docker
- **WHEN** editing a `.tsx` file in `apps/web/src`
- **THEN** changes are reflected in browser within 1-2 seconds (Webpack HMR)

#### Scenario: docker compose down stops container
- **WHEN** running `docker compose down`
- **THEN** container and volumes are cleaned up

### Requirement: Multi-stage Dockerfile for production

The project SHALL have a `Dockerfile` with three stages: `base` (Node.js setup), `deps` (lock file processing), `builder` (Next.js build), and `runner` (production image).

#### Scenario: Build stage compiles Next.js
- **WHEN** running `docker build`
- **THEN** `builder` stage runs `pnpm build` and produces `.next` output

#### Scenario: Runner stage is minimal
- **WHEN** build completes
- **THEN** final image contains only `.next/standalone`, `.next/static`, and `public/` (≤ 300MB)

#### Scenario: Production image uses non-root user
- **WHEN** inspecting the final image
- **THEN** entrypoint runs as `nextjs` user (UID 1001), not root

#### Scenario: Health check is present
- **WHEN** container starts
- **THEN** health check curl is configured (optional for Fase 0, required for Fase 5)

### Requirement: Environment file for Docker dev

A `.env.docker` (or integration with docker-compose env file) SHALL allow Docker to pick up `NEXT_PUBLIC_*` and other vars without hardcoding them in Dockerfile.

#### Scenario: Environment vars pass through
- **WHEN** running docker compose with `.env.docker`
- **THEN** `NEXT_PUBLIC_API_URL` and other vars are available inside container

#### Scenario: Local .env.local is not committed
- **WHEN** checking git status
- **THEN** `.env.local` is in `.gitignore` (dev secrets stay local)

### Requirement: docker-run.mjs script for convenient port selection

A `scripts/docker-run.mjs` script SHALL automatically find a free port and run the production image without manually specifying `-p` flags.

#### Scenario: Auto port selection works
- **WHEN** running `pnpm docker:run` and port 3000 is in use
- **THEN** script finds the next free port (e.g., 3001) and runs container there

#### Scenario: Script prints access URL
- **WHEN** container starts
- **THEN** console prints `App available at http://localhost:<PORT>`
