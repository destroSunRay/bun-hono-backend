# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine AS base
WORKDIR /app
COPY package.json bun.lock ./

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS dev-base
RUN bun install --frozen-lockfile

FROM base AS prod-base
# install with --production (exclude devDependencies)
RUN bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM dev-base AS prod-test
COPY --from=dev-base /app/node_modules node_modules
COPY . .

# [optional] tests & build
CMD ["bun", "test"]

# copy production dependencies and source code into final image
FROM prod-test AS production
COPY --from=prod-base /app/node_modules node_modules
COPY . .

# run the app
USER bun
EXPOSE 8000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]

# copy dev dependencies and source code into final image
FROM base AS development
COPY --from=dev-base /app/node_modules node_modules
COPY . .


USER bun
EXPOSE 8000/tcp
ENTRYPOINT [ "bun", "run", "--hot", "src/index.ts" ]

FROM node:24-alpine AS debug
WORKDIR /app
COPY --from=dev-base /app/node_modules node_modules
COPY . .

ENTRYPOINT ["npx", "drizzle-kit", "migrate"]