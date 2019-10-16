import React from 'react'
import { IMqttClient } from 'async-mqtt';

interface IMqPaneProps {
    client: IMqttClient
    topic: string
}

interface IMqPaneState {
    message: string
}

class MqPane extends React.Component<IMqPaneProps, IMqPaneState> {
    constructor(props: IMqPaneProps) {
        super(props)
        this.state = {
            message: ""
        }
    }

    componentDidMount() {
        let { client, topic } = this.props
        client.subscribe(topic)
        client.on(
            "message",
            this.messageReceived
        )
    }

    componentWillUnmount() {
        let { client, topic } = this.props
        client.unsubscribe(topic)
    }

    messageReceived(topic: string, payload: Buffer) {
        if (topic === this.props.topic) {
            this.setState({
                message: payload.toString()
            })
        }
    }

    render() {
        return (<div />)
    }
}

export default MqPane