import React from "react";
import MqClient from "./MqClient";

export default () => (
    <div>
        <MqClient topic="virtual/screen/#" />
    </div>
)