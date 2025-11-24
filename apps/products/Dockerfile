FROM node:22.21-slim AS base

# INSTALL PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 
FROM base AS prepare
RUN apt-get update
WORKDIR /app
RUN pnpm add turbo --global
COPY . .
RUN turbo prune products --docker

# --
FROM base AS builder
RUN apt-get update
WORKDIR /app

COPY --from=prepare /app/out/json/ .
RUN pnpm install 
# COPY . . 
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build

# --
FROM base AS runner
WORKDIR /app
# COPY --from=builder /app/apps/products/dist ./apps/products/dist
# COPY --from=builder /app/apps/products/package.json ./apps/products/   
# COPY --from=builder /app/apps/products/node_modules ./apps/products/node_modules
COPY --from=builder /app .

EXPOSE 4500

CMD ["node", "apps/products/dist/main.js"]

