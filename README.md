# MQ-Display

Use any web browser as an IoT-connected display. 

1. Configure your MQTT broker to listen on websockets. See [mosquitto.conf]() for an example of a **very** minimal mosquitto configuration that works. For local development a broker has been included (see [Local testing](#manual-test-locally)).

1. Put your broker details in [env.js]().

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
docker-compose up --build mq-display
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
