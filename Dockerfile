# Build image
FROM node:12.11 as build

WORKDIR /project

COPY env.js .
COPY package.json .
COPY tsconfig.json .
COPY webpack.config.js .

COPY src src/
COPY static static/

RUN npm install \
 && npm run build

# Deployment image
FROM halverneus/static-file-server:v1.6.6

COPY --from=build /project/static /web

ENV FOLDER /web
ENV PORT 80
