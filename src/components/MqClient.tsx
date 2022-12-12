import mqtt, { MqttClient, IClientOptions } from 'precompiled-mqtt'
import React from 'react'
import MessagePane, { IPaneData } from './MessagePane'
import Notice from './Notice'

const clientOptions = (hostname: string, port: number): IClientOptions => ({
  clientId: `mq-display-${Date.now()}`,
  connectTimeout: 1000,
  hostname,
  port,
})

enum MqClientStatus {
  Good = 0,
  Error,
  Loading,
}

interface IMqClientProps {
  topic: string
  host: string
  port: number
}

interface IMqMessage {
  topic: string
  payload: string
  timestamp: number
}

interface IMqClientState {
  client: MqttClient
  status: MqClientStatus
  messages: IMqMessage[]
}

class MqClient extends React.Component<IMqClientProps, IMqClientState> {
  constructor(props: any) {
    super(props)
    this.state = {
      client: null,
      status: MqClientStatus.Loading,
      messages: [],
    }
  }

  updateMessages(topic: string, payload: any) {
    console.log(payload.toString())
    let messages = this.state.messages.filter((m) => {
      return m.topic != topic
    })

    let timestamp = Date.now()
    let payloadstr = payload.toString()

    if (payloadstr !== '') {
      messages.push({
        topic,
        payload: payload.toString(),
        timestamp,
      })
    }

    this.setState({ messages })
  }

  connectToMqHost() {
    let connectPromise = new Promise((resolve, reject) => {
      let options = clientOptions(this.props.host, this.props.port)
      console.log(`Connecting to host ${this.props.host}`)
      let client = mqtt.connect(options)
      let timeout = setTimeout(
        () => reject('Client connect timeout'),
        options.connectTimeout
      )
      client.on('connect', () => {
        clearTimeout(timeout)
        resolve(client)
      })
    })

    let subscribePromise = (client: MqttClient) =>
      new Promise((resolve, reject) => {
        console.log(`Subscribing to topic ${this.props.topic}`)
        client.subscribe(this.props.topic, (e) => reject(e))
        client.on('message', (t, p) => this.updateMessages(t, p))
        resolve(client)
      })

    this.setState({
      client: null,
      status: MqClientStatus.Loading,
    })

    connectPromise
      .then((result: MqttClient) => subscribePromise(result))
      .then((result: MqttClient) => {
        this.setState({
          client: result,
          status: MqClientStatus.Good,
        })
      })
      .catch((reason: any) => {
        console.log({ reason })
        this.setState({
          status: MqClientStatus.Error,
        })
      })
  }

  makePaneData(mqMessage: IMqMessage, timestamp: number): IPaneData {
    try {
      return {
        ...JSON.parse(mqMessage.payload),
        timestamp,
      }
    } catch {
      return {
        brightness: 50,
        duration: 0,
        message: `*Unrecognised message:* ${mqMessage.payload}`,
        timestamp,
      }
    }
  }

  componentDidMount() {
    this.connectToMqHost()
  }

  render() {
    let timeSortedMessages = this.state.messages.sort(
      (a, b) => b.timestamp - a.timestamp
    )

    return (
      <>
        {this.state.status == MqClientStatus.Loading && (
          <Notice>Connecting...</Notice>
        )}
        {this.state.status == MqClientStatus.Error && (
          <Notice>An error occurred while connecting to broker</Notice>
        )}
        {timeSortedMessages.map((m, i) => (
          <MessagePane
            key={m.topic}
            topic={m.topic}
            data={this.makePaneData(m, m.timestamp)}
          />
        ))}
      </>
    )
  }
}

export default MqClient
