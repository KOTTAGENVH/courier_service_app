import React from 'react'
import { Spinner } from './loader';

function BgBlurLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-30 backdrop-blur-md">
    <Spinner />
  </div>
  )
}

export default BgBlurLoader;