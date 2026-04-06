'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analysing your workflows…',
  'Identifying automation opportunities…',
  'Calculating time savings…',
  'Preparing your report…',
  'Almost there…',
]

export default function LoadingScreen() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-green-400 animate-spin" />
      </div>
      <p
        className={`text-gray-400 text-lg text-center transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {MESSAGES[index]}
      </p>
    </div>
  )
}
