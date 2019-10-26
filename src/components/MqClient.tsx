import mqtt, { IMqttClient, IClientOptions } from 'async-mqtt'
import React from 'react'
import MessagePane, { IPaneData } from './MessagePane'

declare const MQTT_HOST: string
declare const MQTT_PORT: string

const clientOptions: IClientOptions = {
  clientId: `mq-display-${Math.floor(Math.random() * 1e9)}`,
  connectTimeout: 1000,
  hostname: MQTT_HOST,
  port: parseInt(MQTT_PORT)
}

enum MqClientStatus {
  Good = 0,
  Error,
  Loading
}

interface IMqClientProps {
    topic: string
}

interface IMqMessage { 
  topic: string
  payload: string
  timestamp: number
}

interface IMqClientState {
  client: IMqttClient
  status: MqClientStatus
  messages: IMqMessage[]
}

class MqClient extends React.Component<IMqClientProps, IMqClientState> {
  constructor(props: any) {
    super(props)
    this.state = {
      client: null,
      status: MqClientStatus.Loading,
      messages: []
    }
  }

  updateMessages(topic: string, payload: Buffer) {
    let messages = this.state.messages.filter(m => {
      return m.topic != topic
    })

    let timestamp = Date.now()

    console.log(`message received at ${timestamp}`)
    
    messages.push({
      topic,
      payload: payload.toString(),
      timestamp
    })

    this.setState({ messages })
  }

  connectToMqHost() {
      let connectPromise = new Promise((resolve, reject) => {
        console.log(`Connecting to host ${MQTT_HOST}`)
        let client = mqtt.connect(clientOptions)
        let timeout = setTimeout(
          () => reject("Client connect timeout"),
          clientOptions.connectTimeout
        )
        client.on(
          "connect",
          () => {
            clearTimeout(timeout)
            resolve(client)
          }
        )
      })

      let subscribePromise = (client: IMqttClient) => ( 
        new Promise((resolve, reject) => {
          console.log(`Subscribing to topic ${this.props.topic}`)
          client.subscribe(this.props.topic, e => reject(e))
          client.on(
              "message",
              (t, p) => this.updateMessages(t, p)
          )
          resolve(client)
        })
      )

      this.setState({
          client: null,
          status: MqClientStatus.Loading
      })
      
      connectPromise
        .then((result: IMqttClient) => subscribePromise(result))
        .then((result: IMqttClient )=> {
            this.setState({
                client: result,
                status: MqClientStatus.Good
            })
        }).catch((reason: any) => {
            this.setState({
                status: MqClientStatus.Error
            })
      })
  }

  makePaneData(mqMessage: IMqMessage, timestamp: number): IPaneData {
    try {
      return {
        ...JSON.parse(mqMessage.payload),
        timestamp
      }
    }
    catch {
      return {
        brightness: 50,
        duration: 0,
        message: `*Unrecognised message:* ${mqMessage.payload}`,
        timestamp
      }
    }
  }

  componentDidMount() {
    this.connectToMqHost()
  }

  render() {
    return (
      <div>
        {this.state.status == MqClientStatus.Loading && <span>Loading</span>}
        {this.state.status == MqClientStatus.Error && <span>Error</span>}
        {this.state.messages.map((m, i) => (
          <MessagePane key={m.topic} topic={m.topic} data={this.makePaneData(m, m.timestamp)} />
        ))}
        
      </div>
    )
  }
}

export default MqClient