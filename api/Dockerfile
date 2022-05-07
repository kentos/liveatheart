FROM alpine AS base

RUN apk add --update nodejs npm
RUN addgroup -S nodeusers && adduser -S node -G nodeusers
WORKDIR /app

FROM base AS development
USER node
ENV NODE_ENV=development
VOLUME [ "/app" ]
CMD [ "./node_modules/.bin/nodemon", "--files", "--transpile-only", "./src/server.ts" ]

FROM base AS build
COPY package*.json ./
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

FROM base AS production
COPY --from=build /app/dist ./
COPY --from=build /app/package*.json ./
RUN npm i --production
ENV NODE_ENV=production
USER node
CMD [ "node", "./dist/server.js" ]