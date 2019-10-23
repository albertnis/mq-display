import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import MessageDisplay from './MessageDisplay'

export interface IPaneData {
  message: string
  brightness: number
  duration: number
  timestamp: number
}

interface IPaneProps {
  data: IPaneData
  title: string
}

interface IPaneState {

}

export default (props: IPaneProps) => {
  let { brightness, message, duration, timestamp } = props.data
  const opacity = brightness / 100

  return (
    <div
      className="messagePane"
    >
      <div
        className="messagePane-data"
        style={{ opacity }}
      >
        <MessageDisplay key={timestamp} timestamp={timestamp} message={message} duration={duration} />
      </div>
      <div className="messagePane-toolbar">
        <div className="messagePane-toolbar-topic">
          {props.title}
        </div>
      </div>
    </div>
  )
}