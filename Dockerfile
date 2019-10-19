# Build image
FROM node:12.11 as build

WORKDIR /project

COPY package.json .

RUN npm install

COPY webpack.config.js .
COPY env.js .
COPY tsconfig.json .
COPY src src/
COPY static static/

RUN npm run build

# Deployment image
FROM halverneus/static-file-server:v1.6.6

COPY --from=build /project/static /web

ENV FOLDER /web
ENV PORT 80
