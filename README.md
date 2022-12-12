# MQ-Display

Use any web browser as an IoT-connected display.

![Photo of mq-display](https://albertnis.com/resources/2019-11-02-iot-display-mqtt/mqdisplay-t.jpg)

## Pre-requisites

You'll need an MQTT broker configured to use websockets. See [mosquitto.conf]() for an example of a **very** minimal mosquitto configuration that works. For local development a broker has been included (see [Develop it](#develop-it)). Encrypted websockets are not currently supported.

# Run it

MQ-Display is a frontend-only application. Build the frontend then serve it statically. Once it's running somewhere, simply go to a URL like:

`http://localhost?host=192.168.1.110`

This would be load MQ-Display hosted at `localhost` then direct the webpage to connect to the MQTT server at `192.168.1.110`.

## URL parameters

There are additional URL parameters to configure the connection:

| Parameter key | Description           | Default          |
| ------------- | --------------------- | ---------------- |
| host          | MQTT broker host name | _[required]_     |
| port          | MQTT websockets port  | 9001             |
| topic         | Topic to subscribe to | virtual/screen/# |

> Remember to use URL-escaped characters when specifying a topic.

## Payload schema

MQ-Display expects payloads in JSON format with a particular schema.

| Payload key | Type   | Description                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| brightness  | number | 0-100 indicating opacity of the message. 100 means fully visible. |
| title       | string | title to display faintly above the main message                   |
| message     | string | Message to display in Markdown format                             |
| duration    | number | Milliseconds to display the message before fading out             |

Here's an example:

```json
{
  "brightness": 100,
  "title": "Title",
  "message": "Contents go here",
  "duration": 1000
}
```

# Build it

## With Yarn

The following command will build the bundle to the `./dist` directory.

```sh
yarn build
```

Then serve the `./dist` directory.

## With Docker

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

Now go to a URL like `http://localhost:8080?host=192.168.1.110`

# Develop it

Running as a dev server is best for development. The following command will get it running on port 4000 with hot reloading:

```sh
yarn dev
```

A mosquitto container is configured in `docker-compose.yaml`:

```sh
docker-compose up mosquitto
```

Publish a basic retained (i.e. no `duration`) message with the following:

```sh
docker exec -t mosquitto mosquitto_pub -h localhost -t "virtual/screen/1" -m "{\"brightness\":\"100\",\"message\":\"Fun times\"}" -r
```

Then go to `https://localhost:4000?host=localhost:9001`.

# Caveats

This application lives entirely in the browser. In this context, MQTT connections are done over websockets. This means that to serve MQ-Display over HTTPS, your server will need to be configured with TLS support wss:// protocol as opposed to ws://.
