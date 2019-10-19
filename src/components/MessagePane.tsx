import React from 'react'
import ReactMarkdown from 'react-markdown'

interface IPaneData {
  message: string
  brightness: number
}

interface IPaneProps {
  data: IPaneData
  title: string
}

export default (props: IPaneProps) => (
  <div
    className="messagePane"
  >
    <div
      className="messagePane-data"
      style={{ opacity: props.data.brightness / 100 }}
    >
      <ReactMarkdown className="messagePane-message" source={props.data.message} />
    </div>
    <div className="messagePane-toolbar">
      <div className="messagePane-toolbar-topic">
        {props.title}
      </div>
    </div>
  </div>
)