import mqtt, { IMqttClient, IClientOptions } from 'async-mqtt'
import React from 'react'

declare const MQTT_HOST: string
declare const MQTT_PORT: string

const clientOptions: IClientOptions = {
    clientId: 'mq-display',
    connectTimeout: 1000,
    hostname: MQTT_HOST,
    port: parseInt(MQTT_PORT),
}

enum MqClientStatus {
    Good = 0,
    Error,
    Loading
}

interface MqClientState {
    client: IMqttClient
    status: MqClientStatus
}

class MqClient extends React.Component<any, MqClientState> {
    constructor(props: any) {
        super(props)
        this.state = {
            client: null,
            status: MqClientStatus.Loading
        }
    }

    connectToMqHost() {
        let connectPromise = new Promise((resolve, reject) => {
            console.log(`Connecting to host ${MQTT_HOST}`)
            let client = mqtt.connect(clientOptions)
            resolve(client)
        })

        this.setState({
            client: null,
            status: MqClientStatus.Loading
        })
        
        connectPromise.then((result: IMqttClient )=> {
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
        return (
            <div>
                {this.state.status == MqClientStatus.Good && <span>Good</span>}
                {this.state.status == MqClientStatus.Loading && <span>Loading</span>}
                {this.state.status == MqClientStatus.Error && <span>Error</span>}
            </div>
        )
    }
}

export default MqClient