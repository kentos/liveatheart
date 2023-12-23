FROM node:18-alpine AS base

WORKDIR /app

FROM base AS development
USER node
ENV NODE_ENV=development
VOLUME [ "/app" ]
CMD [ "npm", "run", "dev" ]
