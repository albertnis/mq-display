# MQ-Display

Use any web browser as an IoT-connected display.

## Develop

```sh
npm run dev-server
```

## Build

```sh
npm run build
```

## Run as container

### Docker
```sh
docker build -t mq-display .
docker run -p 8080:80 mq-display
```

### Compose
```sh
docker-compose up
```
