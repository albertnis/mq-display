import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import MessageDisplay from './MessageDisplay'

export interface IPaneData {
  message: string
  brightness: number
  duration: number
  timestamp: number
  title?: string
}

interface IPaneProps {
  data: IPaneData
  topic: string
}

interface IPaneState {

}

const MessagePane = (props: IPaneProps) => {
  let { brightness, message, duration, timestamp, title } = props.data
  const opacity = brightness / 100

  return (
    <div
      className="messagePane"
    >
      <div
        className="messagePane-data"
        style={{ opacity }}
      >
        <MessageDisplay title={title} key={timestamp} timestamp={timestamp} message={message} duration={duration} />
      </div>
      <div className="messagePane-toolbar">
        <div className="messagePane-toolbar-topic">
          {props.topic}
        </div>
      </div>
    </div>
  )
}

export default MessagePane