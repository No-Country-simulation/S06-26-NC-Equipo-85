# S06-26-NC-Equipo-85 — App BiT Frontend

![Project Status](https://img.shields.io/badge/status-initial_setup-blue)
![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss\&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-ready-black)
![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo\&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm\&logoColor=white)

Frontend monorepo for **App BiT**, a No Country simulation project focused on helping underrepresented groups through personalized orientation, education, employability, mentoring, structured experiences and mental health support.

> Current phase: **initial setup / foundation**.
> The repository currently contains the frontend application only. The backend is developed separately by the backend team.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Current Status](#current-status)
* [Tech Stack](#tech-stack)
* [Repository Structure](#repository-structure)
* [Getting Started](#getting-started)
* [Available Scripts](#available-scripts)
* [Environment Variables](#environment-variables)
* [Architecture Guidelines](#architecture-guidelines)
* [Frontend Roadmap](#frontend-roadmap)
* [Backend Integration](#backend-integration)
* [Git Workflow](#git-workflow)
* [Conventions](#conventions)
* [Team Notes](#team-notes)

---

## Project Overview

**App BiT** is an MVP designed to provide integrated guidance for people from underrepresented groups who face barriers related to employment, education and mental health.

The platform aims to include:

* Personalized orientation based on the user's profile.
* Suggested learning paths.
* Employability and job matching.
* Mentorship scheduling.
* Structured experiences and testimonials.
* Mental health check-ins and support flows.
* Future geolocation, offline support and PWA capabilities.

---

## Current Status

The project is currently in its **foundation phase**.

Already configured:

* Turborepo monorepo.
* pnpm workspace.
* Next.js frontend app inside `apps/web`.
* App Router.
* TypeScript.
* Tailwind CSS.
* shadcn/ui initialized.
* Base UI components installed.
* Root-level scripts for development, build, lint and type checking.

Not implemented yet:

* Authentication.
* API integration.
* Dashboard routes.
* Onboarding flow.
* State management.
* Data fetching layer.
* Testing setup.
* Storybook.
* Docker.
* CI/CD pipeline.

---

## Tech Stack

### Current Stack

| Area               | Technology              |
| ------------------ | ----------------------- |
| Monorepo           | Turborepo               |
| Package Manager    | pnpm                    |
| Frontend Framework | Next.js with App Router |
| UI Library         | React                   |
| Language           | TypeScript              |
| Styling            | Tailwind CSS v4         |
| Components         | shadcn/ui               |
| Icons              | Lucide React            |
| Code Quality       | ESLint                  |
| Formatting         | Prettier                |

### Planned Stack

These technologies are planned for future phases and should be added only when needed:

| Area                 | Technology                     |
| -------------------- | ------------------------------ |
| Forms                | React Hook Form + Zod          |
| Server State         | TanStack Query                 |
| Client State         | Zustand                        |
| Tables               | TanStack Table                 |
| Charts               | Recharts                       |
| Animations           | Framer Motion                  |
| Notifications        | Sonner                         |
| Testing              | Vitest + React Testing Library |
| E2E Testing          | Playwright                     |
| API Mocking          | MSW                            |
| Accessibility Audits | axe-core                       |
| Component Docs       | Storybook                      |
| Internationalization | next-intl                      |
| Error Tracking       | Sentry                         |
| PWA                  | next-pwa / Workbox             |

---

## Repository Structure

```txt
S06-26-NC-Equipo-85/
├── apps/
│   └── web/                    # Frontend application
│       ├── public/             # Static assets
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   │   ├── favicon.ico
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   └── ui/         # shadcn/ui components
│       │   └── lib/
│       │       └── utils.ts    # Shared frontend utilities
│       ├── components.json     # shadcn/ui config
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       └── tsconfig.json
├── packages/                   # Future shared packages
├── .gitignore
├── package.json                # Root scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Getting Started

### Prerequisites

Install the following tools:

* Node.js LTS
* pnpm
* Git

Check your versions:

```bash
node -v
pnpm -v
git --version
```

If pnpm is not installed:

```bash
npm install -g pnpm
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/No-Country-simulation/S06-26-NC-Equipo-85.git
```

Enter the project:

```bash
cd S06-26-NC-Equipo-85
```

Install dependencies from the repository root:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

The frontend should be available at:

```txt
http://localhost:3000
```

---

## Available Scripts

Run all commands from the repository root.

```bash
pnpm dev
```

Starts the frontend app through Turborepo.

```bash
pnpm build
```

Builds the project.

```bash
pnpm lint
```

Runs linting.

```bash
pnpm type-check
```

Runs TypeScript validation without emitting files.

```bash
pnpm format
```

Formats supported files with Prettier.

---

## Environment Variables

Create this file inside the frontend app when API integration starts:

```txt
apps/web/.env.local
```

Base example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Also create a committed example file:

```txt
apps/web/.env.example
```

```env
NEXT_PUBLIC_API_URL=
```

Important rules:

* Never commit `.env.local`.
* Never commit secrets.
* Public frontend variables must start with `NEXT_PUBLIC_`.
* Backend secrets must never be exposed in the frontend.

---

## Architecture Guidelines

### Server-first approach

Use **Server Components by default**.

Only use `"use client"` for leaf components that need:

* Local state.
* Event handlers.
* Browser APIs.
* Form interaction.
* Client-side animations.
* Client-only hooks.

### Recommended frontend structure

As the project grows, the frontend should evolve toward this structure:

```txt
apps/web/src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   └── ui/
├── config/
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── orientation/
│   ├── health/
│   ├── mentorship/
│   └── experiences/
├── hooks/
├── lib/
├── services/
├── stores/
└── types/
```

### Component rules

* Keep components small and focused.
* Avoid mixing business logic with UI rendering.
* Use semantic HTML.
* Prioritize accessibility from the beginning.
* Document reusable components with JSDoc.
* Avoid premature abstraction.
* Avoid large client components at route level.

---

## Frontend Roadmap

### Phase 0 — Foundation

Current phase.

Main goals:

* Keep monorepo stable.
* Clean the default Next.js template.
* Define base layout.
* Define project folders.
* Add environment examples.
* Prepare initial API contract documentation.
* Define UI foundations.

### Phase 1 — UI Foundation

Planned:

* Base layout.
* App shell.
* Navigation.
* Reusable UI components.
* Toast system with Sonner.
* Initial accessibility rules.
* Optional Storybook setup.

### Phase 2 — Onboarding

Planned:

* Multi-step onboarding flow.
* Form validation with React Hook Form and Zod.
* Persisted onboarding state.
* Profile creation and update flow.
* Integration with backend profile endpoints.

### Phase 3 — Dashboard

Planned modules:

* Orientation summary.
* Suggested learning path.
* Job matching.
* Mentorship.
* Structured experiences.
* Mental health check-in.

### Phase 4 — Advanced Features

Planned:

* PWA support.
* Offline capabilities.
* Push notifications.
* Geolocation-based events.
* Performance optimization.

### Phase 5 — QA and Deployment

Planned:

* Unit tests.
* Integration tests.
* E2E tests.
* Accessibility audit.
* Production deployment.
* Monitoring.

---

## Backend Integration

The backend is developed in a separate repository using Java and Spring Boot.

Expected backend responsibilities:

* Authentication.
* User profile.
* Orientation engine.
* Job matching.
* Courses.
* Mental health check-in.
* Mentorship scheduling.
* Experiences feed.
* Geolocation events.
* Push notifications.

### Initial expected endpoints

These endpoints are based on the current planning documents and may change when the API contract is formalized.

| Method | Endpoint                 | Purpose                                 |
| ------ | ------------------------ | --------------------------------------- |
| `POST` | `/auth/register`         | Create user account                     |
| `POST` | `/auth/login`            | Authenticate user                       |
| `POST` | `/auth/refresh`          | Refresh access token                    |
| `GET`  | `/perfil`                | Get authenticated user profile          |
| `PUT`  | `/perfil`                | Update authenticated user profile       |
| `POST` | `/orientar`              | Get orientation, gap and suggested path |
| `GET`  | `/cursos`                | Get available courses                   |
| `GET`  | `/vacantes`              | Get compatible jobs                     |
| `POST` | `/salud`                 | Submit mental health check-in           |
| `GET`  | `/salud/historial`       | Get mental health history               |
| `POST` | `/salud/stream`          | Stream AI response through SSE          |
| `GET`  | `/mentores`              | List mentors                            |
| `POST` | `/mentores/{id}/agendar` | Book mentorship session                 |
| `GET`  | `/experiencias`          | Get structured experiences              |
| `GET`  | `/eventos`               | Get geolocation-based events            |
| `POST` | `/push/suscribir`        | Register push subscription              |

### Integration rule

The frontend should not depend on undocumented backend behavior.

Before consuming an endpoint, the team should define:

* URL.
* Method.
* Request body.
* Response shape.
* Error shape.
* Auth requirements.
* Loading state.
* Empty state.
* Error state.

Recommended location for the contract:

```txt
docs/api-contract.md
```

---

## Git Workflow

Recommended branch naming:

```txt
feature/short-description
fix/short-description
chore/short-description
docs/short-description
refactor/short-description
```

Examples:

```txt
feature/base-layout
feature/onboarding-wizard
fix/navbar-mobile
docs/update-readme
chore/configure-eslint
```

### Commit convention

Use clear and consistent commit messages:

```txt
type: short description
```

Examples:

```txt
chore: initialize frontend monorepo
docs: update project readme
feature: add base layout
fix: resolve mobile navigation spacing
refactor: split dashboard components
```

Common types:

* `chore`
* `docs`
* `feature`
* `fix`
* `refactor`
* `style`
* `test`

---

## Conventions

### File naming

Use kebab-case for folders and most files:

```txt
user-profile-card.tsx
onboarding-step.tsx
api-client.ts
```

Use PascalCase only for component names inside the file:

```tsx
export function UserProfileCard() {}
```

### TypeScript

* Avoid `any`.
* Prefer explicit types for public functions.
* Keep shared types in `src/types`.
* Keep API response types close to the API layer or feature module.
* Use strict validation for external data.

### Styling

* Use Tailwind CSS utilities.
* Use shadcn/ui as the base UI system.
* Avoid random one-off styles.
* Keep design tokens centralized in CSS variables.
* Do not duplicate component variants manually if they belong in reusable components.

### Accessibility

Every interactive component should include:

* Proper semantic element.
* Keyboard support.
* Visible focus state.
* Accessible name.
* Correct ARIA attributes only when needed.
* Valid label association for form fields.

### Documentation

Use JSDoc for:

* Reusable components.
* Complex hooks.
* API client functions.
* Data transformation utilities.
* Business logic.

Example:

```ts
/**
 * Formats a percentage value for user-facing orientation metrics.
 *
 * @param value - Raw percentage value from the API.
 * @returns A formatted percentage string.
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
```

---

## Team Notes

This repository currently contains the frontend application only.

The frontend lives in:

```txt
apps/web
```

The root files exist because this project uses pnpm workspaces and Turborepo.

Do not move `apps/web` into a `frontend` folder unless the team decides to remove the monorepo architecture.

Current correct structure:

```txt
apps/web
```

Not recommended for this setup:

```txt
frontend
```

---

## Maintainers

No Country Simulation — S06-26-NC-Equipo-85

Frontend team:

* Lucas Epherra
* Frontend contributors to be added

Backend team:

* Backend contributors to be added

---

## License

This project is part of a No Country simulation and is currently intended for educational and portfolio purposes.

License status: pending.
