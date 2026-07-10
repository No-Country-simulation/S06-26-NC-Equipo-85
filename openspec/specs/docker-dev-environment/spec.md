# docker-dev-environment Specification

## Purpose

Provide a containerized development experience (`docker compose up`) and a small, secure multi-stage production image, so the app runs consistently across machines and is deploy-ready.

## Requirements

### Requirement: Docker Compose for development

The project SHALL have a `docker-compose.yml` that runs the Next.js dev server with the source mounted as a volume for hot-reload. It SHALL build from the `deps` stage (dependencies pre-installed) and bind the dev server to `0.0.0.0`.

#### Scenario: docker compose up starts dev server
- **WHEN** running `docker compose up` from project root
- **THEN** the Next.js dev server starts inside the container and is reachable at `http://localhost:3000` from the host

#### Scenario: Source is mounted for reload
- **WHEN** editing a `.tsx` file in `apps/web/src`
- **THEN** the change is picked up by the dev server (source is volume-mounted; `node_modules` and `.next` are preserved via anonymous volumes)

#### Scenario: docker compose down stops container
- **WHEN** running `docker compose down`
- **THEN** the container and its network are removed

### Requirement: Multi-stage Dockerfile for production

The project SHALL have a `Dockerfile` with stages `base` (Node 22 + pnpm), `deps` (frozen install), `builder` (Next.js build), and `runner` (standalone production image).

#### Scenario: Build stage compiles Next.js
- **WHEN** running `docker build`
- **THEN** the `builder` stage runs the web build and produces standalone `.next` output

#### Scenario: Runner stage is minimal
- **WHEN** the build completes
- **THEN** the final image contains the standalone server, static assets, and `public/` (~300MB)

#### Scenario: Production image uses non-root user
- **WHEN** inspecting the running container
- **THEN** the process runs as the `nextjs` user (UID 1001), not root

### Requirement: Environment configuration for Docker

Docker SHALL receive `NEXT_PUBLIC_*` and other env vars without hardcoding secrets in the Dockerfile (via compose `environment` / env files). Local secrets SHALL stay out of version control.

#### Scenario: Environment vars pass through
- **WHEN** running docker compose
- **THEN** `NEXT_PUBLIC_API_URL` and other declared vars are available inside the container

#### Scenario: Local .env.local is not committed
- **WHEN** checking git status
- **THEN** `.env*` (except `.env.example`) is gitignored so dev secrets stay local

### Requirement: docker-run.mjs script for convenient port selection

A `scripts/docker-run.mjs` script SHALL automatically find a free port and run the production image without manually specifying `-p` flags.

#### Scenario: Auto port selection works
- **WHEN** running `pnpm docker:run` and port 3000 is in use
- **THEN** the script finds the next free port and runs the container there

#### Scenario: Script prints the chosen port
- **WHEN** the container starts
- **THEN** the console prints the port the app is being served on
