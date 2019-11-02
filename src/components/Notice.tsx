import { PropsWithChildren } from 'react'
import React from 'react';

export default (props: PropsWithChildren<{}>) => (
  <div className="notice">{props.children}</div>
)