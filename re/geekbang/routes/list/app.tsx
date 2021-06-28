import React from 'react'
import Container from './component/container'

export default function (reactData: any[]) {
  return (
    <Container
      columns={reactData}
      filt={(type: number) => {
        console.log(`type filt`, type)
      }}
      sort={(type: number) => {
        console.log(`type sort`, type)
      }}
    />
  )
}
