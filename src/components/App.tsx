import React from "react";
import MqClient from "./MqClient";
import Notice from "./Notice";

const App = () => {
  const params = new URLSearchParams(window.location.search)
  const host = params.get('host')
  const port = params.has('port') ? parseInt(params.get('port')) : 9001
  const topic = params.has('topic') ? params.get('topic') : 'virtual/screen/#'
  return (
    <>
      {host === null &&
        <Notice>No parameter provided for host</Notice>
      }
      {![topic, host, port].includes(null) && 
        <MqClient host={host} port={port} topic={topic} />
      }
    </>
  )
}

export default App