# Build image
FROM node:18-alpine as build

WORKDIR /project

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY vite.config.ts .
COPY tsconfig.json .
COPY src src/

RUN yarn build

# Deployment image
FROM halverneus/static-file-server:v1.6.6

COPY --from=build /project/dist /web

ENV FOLDER /web
ENV PORT 80
