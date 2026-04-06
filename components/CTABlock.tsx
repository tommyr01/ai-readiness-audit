'use client'

import { motion } from 'framer-motion'

const CALENDAR_URL = 'https://calendar.app.google/zifeKDgV3tkFgrmq6'

export default function CTABlock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
    >
      <h2 className="text-2xl sm:text-3xl font-black text-white">
        Ready to reclaim those hours?
      </h2>
      <p className="text-gray-400 text-sm max-w-sm">
        Book a free 20-minute call. Tommy will come prepared with a plan specific to your business.
      </p>
      <a
        href={CALENDAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-400 text-black font-black px-8 py-3 rounded-xl transition-colors text-sm tracking-wide"
      >
        Show me where to start →
      </a>
      <p className="text-gray-600 text-xs">No pitch. No commitment. Just a focused 20 minutes.</p>
    </motion.div>
  )
}
