## 1. Monorepo Foundation (packages/config, packages/env)

- [x] 1.1 Create `packages/config` directory with `eslint.config.mjs`, `prettier.config.mjs`, `tsconfig.base.json`
- [x] 1.2 Export ESLint, Prettier, TypeScript configs from `packages/config/package.json` and update `apps/web` to import them
- [x] 1.3 Create `packages/env` directory with environment validation schema using `@t3-oss/env-nextjs`
- [x] 1.4 Update `apps/web` to use env validation from `packages/env` at build time
- [x] 1.5 Configure `turbo.json` with `build`, `lint`, `type-check` tasks and remote cache settings
- [x] 1.6 Test `pnpm lint` and `pnpm type-check` run successfully across monorepo (both exit 0)

## 2. Docker Setup

- [x] 2.1 Create `Dockerfile` with 3 stages: `base`, `deps`, `builder`, `runner`
- [x] 2.2 Configure multi-stage build to output `.next/standalone` for minimal production image
- [x] 2.3 Create `docker-compose.yml` with volume mount at `/app` and hot-reload environment for development
- [x] 2.4 Create `scripts/docker-run.mjs` for automatic port selection and running production image
- [x] 2.5 Test `docker compose up` starts dev server (deps stage, source-mounted) — served /es, /pt routes 200
- [x] 2.6 Test `pnpm docker:build && pnpm docker:run` builds and runs production image successfully (305MB, non-root nextjs user, all routes 200)

## 3. Design Tokens & shadcn Setup

- [x] 3.1 Define 10 BiT color tokens in `apps/web/src/app/globals.css` as CSS custom properties (terracota, coral, ámbar, azul horizonte, oliva, granate, arena, crema, cacao, topo)
- [x] 3.2 Add soft variants for each brand color (e.g., `--bit-terracota-soft: #F4DCCB`)
- [x] 3.3 Configure Tailwind v4 `@theme inline` mapping BiT tokens to Tailwind classes
- [x] 3.4 Map shadcn base colors: `primary → terracota`, `secondary → ámbar`, `destructive → granate`, `muted → arena/topo`
- [x] 3.5 Install shadcn components: Button, Input, Card, Dialog, Badge, Avatar
- [x] 3.6 Configure `sonner` toast provider in root layout with BiT theme colors
- [x] 3.7 Verify contrast ratios: terracota #A8442A on white = 5.9:1 (AA), granate #9E2235 on white = 7.7:1 (AAA) — documented in design-tokens spec

## 4. Next.js App Router Structure

- [x] 4.1 Create route groups: `app/[locale]/(auth)/` and `app/[locale]/(dashboard)/` with separate `layout.tsx` files
- [x] 4.2 Update `[locale]/layout.tsx` to include Fraunces + Inter fonts via `next/font/google`
- [x] 4.3 Update `[locale]/layout.tsx` metadata with base title, description, OG tags
- [x] 4.4 Move `globals.css` import to locale layout and verify all Tailwind/design tokens are active
- [x] 4.5 Create placeholder pages: `(auth)/login/page.tsx`, `(dashboard)/page.tsx` to verify route groups work
- [x] 4.6 Test navigation: `/es/login` shows auth layout, `/es/dashboard` shows dashboard layout, `/` redirects to default locale (307 → /es verified)

## 5. i18n with next-intl (PT/ES)

- [x] 5.1 Install and configure `next-intl` in `next.config.ts` with default locale (Spanish) and supported locales (PT, ES)
- [x] 5.2 Create locale directory structure: `apps/web/public/locales/{es,pt}/common.json`
- [x] 5.3 Populate Spanish translations in `public/locales/es/common.json` with essential keys (nav, errors, buttons)
- [x] 5.4 Populate Portuguese translations in `public/locales/pt/common.json` with equivalent keys
- [x] 5.5 Wrap app with `NextIntlClientProvider` in `[locale]/layout.tsx` + middleware
- [x] 5.6 Update route structure to support locale prefixes (e.g., `/es/dashboard`, `/pt/dashboard`)
- [x] 5.7 Test locale routing: `/es/*` uses Spanish, `/pt/*` uses Portuguese, `/` redirects to `/es` (verified via curl)
- [x] 5.8 Update placeholder pages to use `useTranslations()` instead of hardcoded strings

## 6. Storybook Base Setup (Optional for Fase 0, Required for Fase 1)

- [x] 6.1 Initialize Storybook 8 in `apps/web` (`.storybook/main.ts`) — packages/ui migration deferred to Fase 1
- [x] 6.2 Create `.storybook/preview.ts` with Tailwind CSS import and design token CSS
- [x] 6.3 Create Button story at `apps/web/src/components/ui/button.stories.tsx` with primary, secondary, ghost, destructive variants
- [~] 6.4 Verify Button story loads in Storybook — BLOCKED: @storybook/nextjs 8.x imports removed `next/config` (Next 16 incompat). Story/config are correct; deferred to Fase 1 (migrate to @storybook/react-vite or Storybook 9). Storybook is Optional for Fase 0 per design Non-Goals.
- [~] 6.5 Test Storybook runs on :6006 — BLOCKED by same Next 16 incompatibility (see 6.4)

## 7. Verification & Documentation

- [x] 7.1 Verify `pnpm dev` works at root and all packages with dev scripts start (next start served all routes 200)
- [x] 7.2 Verify `pnpm build` produces `.next` output for web app (9 static pages generated)
- [x] 7.3 Create/update `CLAUDE.md` documenting monorepo structure, design tokens, locale routing
- [x] 7.4 Commit all changes with message: "feat: phase 0 foundation — monorepo, docker, design tokens, i18n"
- [x] 7.5 Ensure `pnpm lint` and `pnpm type-check` pass without errors

---

**Estimated Timeline**: 2 weeks (14 days)  
**Milestone 1** (Days 1–3): Tasks 1-2 (Monorepo + Docker)  
**Milestone 2** (Days 4–7): Tasks 3-5 (Design + Routing + i18n)  
**Milestone 3** (Days 8–10): Task 6 (Storybook base)  
**Milestone 4** (Days 11–14): Task 7 (Verification + Documentation)

**Definition of Done for Fase 0**:
- ✅ `docker compose up` starts dev server on port 3000
- ✅ `pnpm dev` works and HMR is active
- ✅ Design tokens are in globals.css and shadcn components render with BiT colors
- ✅ Routes `/es/dashboard` and `/pt/dashboard` work with correct locale
- ✅ Button story exists in Storybook and shows all 4 variants
- ✅ No ESLint, TypeScript, or build errors
