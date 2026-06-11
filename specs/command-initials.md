Guía: Comandos para empezar el día
1. Setup inicial (primera vez o después de cambios en pnpm-lock.yaml)

# Instalar/actualizar dependencias
pnpm install

2. Dev Manual (sin Docker)
# Terminal 1: Dev server Next.js

pnpm dev
# Abre http://localhost:3000

# Terminal 2 (opcional): Storybook de componentes UI

pnpm --filter @app/ui storybook
# Abre http://localhost:6006

3. Verificación rápida (antes de pushear)

# Lint + type-check + build (turbo en paralelo)
pnpm lint && pnpm type-check && pnpm build

4. Dev con Docker (hot-reload en contenedor)

# Asegurate que puerto 3000 esté libre en tu máquina
docker compose up

# Abre http://localhost:3000
# Ctrl+C para detener

5. Prod con Docker (build + run)

# Build imagen prod y corre en puerto libre automático
pnpm docker:up

# El script imprime el puerto en consola
# Ctrl+C para detener el contenedor

Orden recomendado cada mañana
pnpm install (si hubo cambios en lock)
pnpm lint && pnpm type-check && pnpm build (chequeo rápido)
Elige:
Manual dev: pnpm dev + pnpm --filter @app/ui storybook
Docker dev: docker compose up
Nota: Si Node local es 20, actualizar a 22 o user nvm use node 22.