FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.5.2 --activate

# ---- Install dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/typescript/package.json packages/config/typescript/package.json
COPY packages/config/eslint/package.json packages/config/eslint/package.json
COPY packages/config/prettier/package.json packages/config/prettier/package.json
RUN pnpm install --frozen-lockfile --filter web...

# ---- Build ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .
RUN pnpm --filter web build

# ---- Run ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
