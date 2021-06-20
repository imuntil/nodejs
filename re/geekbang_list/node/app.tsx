import React from 'react'
import Container from '../component/container'

export default function (reactData: any[]) {
  return <Container columns={reactData} filt={() => {}} sort={() => {}} />
}
