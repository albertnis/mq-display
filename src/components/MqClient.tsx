import mqtt, { IMqttClient, IClientOptions } from 'async-mqtt'
import React from 'react'
import MessagePane from './MessagePane'

declare const MQTT_HOST: string
declare const MQTT_PORT: string

const clientOptions: IClientOptions = {
  clientId: 'mq-display',
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
    
    messages.push({
      topic,
      payload: payload.toString()
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

  disconnectFromMqHost() {
    let disconnectPromise = new Promise((resolve, reject) => {
      this.state.client.end()
      resolve()
    })

    this.setState({
      status: MqClientStatus.Loading
    })
    
    disconnectPromise.then((result: any )=> {
      this.setState({
        client: null,
        status: MqClientStatus.Good
      })
    }).catch((reason: any) => {
        this.setState({
        status: MqClientStatus.Error
      })
    })
  }

  componentDidMount() {
    this.connectToMqHost()
  }

  componentWillUnmount() {
    this.disconnectFromMqHost()
  }

  render() {
    let thangz = ['a', 'b', 'c']
    return (
      <div>
        {this.state.status == MqClientStatus.Loading && <span>Loading</span>}
        {this.state.status == MqClientStatus.Error && <span>Error</span>}
        {this.state.messages.map((m, i) => (
          <MessagePane key={i} title={m.topic} data={JSON.parse(m.payload)} />
        ))}
        
      </div>
    )
  }
}

export default MqClient