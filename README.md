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
docker-compose up --build
```

## Manual test locally

A mosquitto container is configured in `docker-compose.yaml`:

```sh
docker-compose up mosquitto
```

Publish a basic retained message with the following:

```sh
docker exec -t mosquitto mosquitto_pub -h localhost -t "virtual/screen/1" -m "{\"brightness\":\"100\",\"message\":\"Fun times\"}" -r
```

