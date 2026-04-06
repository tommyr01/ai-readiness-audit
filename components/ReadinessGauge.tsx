'use client'

import { useEffect, useState } from 'react'
import { useSpring, useMotionValue } from 'framer-motion'

interface Props {
  score: number
}

function getColor(score: number) {
  if (score >= 70) return '#4ade80'  // green-400
  if (score >= 40) return '#fbbf24'  // amber-400
  return '#60a5fa'                   // blue-400
}

function getLabel(score: number) {
  if (score >= 70) return 'HIGH OPPORTUNITY'
  if (score >= 40) return 'MODERATE OPPORTUNITY'
  return 'LOW OPPORTUNITY'
}

export default function ReadinessGauge({ score }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const motionScore = useMotionValue(0)
  const springScore = useSpring(motionScore, { stiffness: 60, damping: 12 })

  useEffect(() => {
    const timeout = setTimeout(() => {
      motionScore.set(score)
    }, 300)
    return () => clearTimeout(timeout)
  }, [score, motionScore])

  useEffect(() => {
    return springScore.on('change', v => setDisplayed(Math.round(v)))
  }, [springScore])

  const color = getColor(score)
  const label = getLabel(score)

  const radius = 80
  const cx = 100
  const cy = 100
  const startAngle = -200
  const endAngle = 20
  const totalAngle = endAngle - startAngle

  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcX = (angle: number) => cx + radius * Math.cos(toRad(angle))
  const arcY = (angle: number) => cy + radius * Math.sin(toRad(angle))

  const bgPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${radius} ${radius} 0 1 1 ${arcX(endAngle)} ${arcY(endAngle)}`
  const progress = displayed / 100
  const currentAngle = startAngle + totalAngle * progress
  const fgPath = progress > 0
    ? `M ${arcX(startAngle)} ${arcY(startAngle)} A ${radius} ${radius} 0 ${progress > 0.5 ? 1 : 0} 1 ${arcX(currentAngle)} ${arcY(currentAngle)}`
    : ''

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-56 h-48">
        <svg viewBox="0 0 200 140" className="w-full h-full">
          <path d={bgPath} fill="none" stroke="#1f2937" strokeWidth="12" strokeLinecap="round" />
          {fgPath && (
            <path d={fgPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-5xl font-black tabular-nums" style={{ color }}>
            {displayed}
          </span>
          <span className="text-xs font-bold tracking-widest mt-1" style={{ color }}>
            {label}
          </span>
        </div>
      </div>
      <p className="text-gray-500 text-sm">automation opportunity score</p>
    </div>
  )
}
