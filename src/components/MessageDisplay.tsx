import ReactMarkdown from 'react-markdown'
import React, { useEffect, useState } from 'react'

interface IMessageDisplayProps {
  message: string
  duration: number
  timestamp: number
  title: string
}

const MessageDisplay = (props: IMessageDisplayProps) => {
  let { message, duration } = props
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (duration != null && duration > 0) {
      const timer = setTimeout(() => {
        setOpacity(0)
      }, duration)
      return () => clearTimeout(timer)
    }
  })

  return (
    <div className="messageDisplay" style={{ opacity }}>
      <div className="messageDisplay-titleBlock">
        {props.title !== undefined && (
          <>
            <div className="messageDisplay-title">{props.title}</div>
          </>
        )}
      </div>
      <ReactMarkdown className="messageDisplay-message" children={message} />
    </div>
  )
}

const timestampsEqual = (
  prevProps: IMessageDisplayProps,
  nextProps: IMessageDisplayProps
) => nextProps.timestamp === prevProps.timestamp

export default React.memo(MessageDisplay, timestampsEqual)
