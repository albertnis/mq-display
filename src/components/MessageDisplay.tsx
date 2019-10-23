import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";

interface IMessageDisplayProps {
  message: string
  duration: number
  timestamp: number
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
    <div className="messageDisplay" style={{ opacity }} >
      <ReactMarkdown className="messageDisplay-message" source={message} />
    </div>
  )
}

const timestampsEqual = (prevProps: IMessageDisplayProps, nextProps: IMessageDisplayProps) => (
  nextProps.timestamp === prevProps.timestamp
)

export default React.memo(MessageDisplay, timestampsEqual)