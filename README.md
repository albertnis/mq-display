# MQ-Display

[![Netlify Status](https://api.netlify.com/api/v1/badges/514ec4fb-d1ab-432b-bcbc-d5d6414eca2e/deploy-status)](https://app.netlify.com/sites/mq-display/deploys)

Use any web browser as an IoT-connected display.

![Photo of mq-display](https://albertnis.com/resources/2019-11-02-iot-display-mqtt/mqdisplay-t.jpg)

## Pre-requisites

You'll need an MQTT broker configured to use websockets. See [mosquitto.conf]() for an example of a **very** minimal mosquitto configuration that works. For local development a broker has been included (see [Develop it](#develop-it)). Encrypted websockets are not currently supported.


# Run it

Simply add to an exising docker-compose file with a remote build target. No prior clone required!

```yaml
version: "2.4"
services:
  ...
  mq-display:
      container_name: mq-display
      build: https://github.com/albertnis/mq-display.git#master
      ports:
        - 8080:80
```

Alternatively clone and build with Docker or Docker Compose:

- Docker
  ```sh
  docker build -t mq-display .
  docker run -p 8080:80 mq-display
  ```

- Compose
  ```sh
  docker-compose up --build mq-display
  ```

Once it's up and running, go to the host and specify the MQTT host as a URL parameter. For example if I was running mq-display at `localhost` and connecting to a broker at `192.168.1.110` I would go to the following address:

`http://localhost?host=192.168.1.110`

## Query string parameters

Parameter key | Description | Default
--- | --- | ---
host | MQTT broker host name | *[required]*
port | MQTT websockets port | 9001
topic | Topic to subscribe to | virtual/screen/#

> Remember to use URL-escaped characters when specifying a topic.

# Build it

The following command will build the bundle to the `./static` directory.

```sh
npm run build
```

Then serve the `./static` directory.

# Develop it

Running as a dev server is best for development. The following command will get it running on port 4000 with hot reloading:

```sh
npm run dev-server
```

A mosquitto container is configured in `docker-compose.yaml`:

```sh
docker-compose up mosquitto
```

Publish a basic retained message with the following:

```sh
docker exec -t mosquitto mosquitto_pub -h localhost -t "virtual/screen/1" -m "{\"brightness\":\"100\",\"message\":\"Fun times\"}" -r
```

Then go to `https://localhost:4000?host=localhost:9001`.
