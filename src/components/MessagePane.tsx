import React from 'react'

interface IPaneData {
    message: string
    brightness: number
}

interface IPaneProps {
    data: IPaneData
    title: string
}

export default (props: IPaneProps) => (
    <div style={{ opacity: props.data.brightness / 100 }}>
        <h1>{props.title}</h1>
        {props.data.message}
    </div>
)