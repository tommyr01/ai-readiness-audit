'use client'

import { motion } from 'framer-motion'
import { QuizQuestion as QuizQuestionType } from '@/lib/questions'

interface Props {
  question: QuizQuestionType
  selected: string | string[]
  onSelect: (value: string | string[]) => void
  onNext?: () => void  // only needed for multi-select
  onBack: () => void
  showBack: boolean
}

export default function QuizQuestion({
  question,
  selected,
  onSelect,
  onNext,
  onBack,
  showBack,
}: Props) {
  const isMulti = question.type === 'multi'
  const selectedArr = Array.isArray(selected) ? selected : []

  function handleSingleSelect(option: string) {
    onSelect(option)
  }

  function handleMultiToggle(option: string) {
    const current = Array.isArray(selected) ? selected : []
    if (current.includes(option)) {
      onSelect(current.filter(o => o !== option))
    } else if (current.length < 3) {
      onSelect([...current, option])
    }
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-6"
    >
      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
        {question.question}
      </h2>

      {isMulti && (
        <p className="text-gray-500 text-sm -mt-3">Select up to 3</p>
      )}

      <div className="flex flex-col gap-3">
        {question.options.map(option => {
          const isSelected = isMulti
            ? selectedArr.includes(option)
            : selected === option

          return (
            <button
              key={option}
              onClick={() =>
                isMulti ? handleMultiToggle(option) : handleSingleSelect(option)
              }
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-150
                ${
                  isSelected
                    ? 'bg-green-950 border-green-600 text-green-300'
                    : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                }`}
            >
              {option}
            </button>
          )
        })}
      </div>

      {isMulti && (
        <button
          onClick={onNext}
          disabled={selectedArr.length === 0}
          className="bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-black px-6 py-3 rounded-xl transition-colors text-sm tracking-wide self-end"
        >
          Done →
        </button>
      )}

      {showBack && (
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-400 text-sm transition-colors self-start"
        >
          ← Back
        </button>
      )}
    </motion.div>
  )
}
