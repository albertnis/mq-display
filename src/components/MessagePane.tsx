import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export interface IPaneData {
  message: string
  brightness: number
  duration: number
}

interface IPaneProps {
  data: IPaneData
  title: string
}

interface IPaneState {

}

export default (props: IPaneProps) => {
  let { brightness, message, duration } = props.data
  const [opacity, setOpacity] = useState(brightness / 100)

  useEffect(() => {
    if (duration != null && duration > 0) {
      const timer = setTimeout(() => {
        setOpacity(0)
      }, duration)
      return () => clearTimeout(timer)
    }
  })

  return (
    <div
      className="messagePane"
    >
      <div
        className="messagePane-data"
        style={{ opacity }}
      >
        <ReactMarkdown className="messagePane-message" source={message} />
      </div>
      <div className="messagePane-toolbar">
        <div className="messagePane-toolbar-topic">
          {props.title}
        </div>
      </div>
    </div>
  )
}