'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS } from '@/lib/questions'
import { QuizAnswers, AuditReport } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import QuizQuestion from '@/components/QuizQuestion'
import LoadingScreen from '@/components/LoadingScreen'
import ReadinessGauge from '@/components/ReadinessGauge'
import OpportunityCard from '@/components/OpportunityCard'
import CTABlock from '@/components/CTABlock'

type AppState = 'intro' | 'quiz' | 'opentext' | 'loading' | 'result' | 'error'

const EMPTY_ANSWERS: QuizAnswers = {
  wasteArea: '',
  frequency: '',
  businessType: '',
  teamSize: '',
  tools: [],
  enquiryHandling: '',
  hoursWasted: '',
  frustration: '',
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS)
  const [openText, setOpenText] = useState('')
  const [report, setReport] = useState<AuditReport | null>(null)
  const [error, setError] = useState('')

  function handleStart() {
    setAppState('quiz')
    setCurrentQ(0)
    setAnswers(EMPTY_ANSWERS)
  }

  function handleAnswer(value: string | string[]) {
    const question = QUESTIONS[currentQ]
    setAnswers(prev => ({ ...prev, [question.id]: value }))

    // Single-select auto-advances; multi-select waits for Done button
    if (question.type === 'single') {
      advanceQuiz()
    }
  }

  function advanceQuiz() {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      setAppState('opentext')
    }
  }

  function handleBack() {
    if (appState === 'opentext') {
      setAppState('quiz')
      setCurrentQ(QUESTIONS.length - 1)
    } else if (currentQ > 0) {
      setCurrentQ(q => q - 1)
    } else {
      setAppState('intro')
    }
  }

  async function submitAudit(text?: string) {
    setAppState('loading')
    setError('')
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, openText: text || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        setAppState('error')
        return
      }
      setReport(data)
      setAppState('result')
    } catch {
      setError('Connection failed. Try again.')
      setAppState('error')
    }
  }

  function handleReset() {
    setAppState('intro')
    setCurrentQ(0)
    setAnswers(EMPTY_ANSWERS)
    setOpenText('')
    setReport(null)
    setError('')
  }

  const currentQuestion = QUESTIONS[currentQ]
  const currentAnswer = answers[currentQuestion?.id as keyof QuizAnswers] ?? ''

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-12 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {appState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-8 text-center"
            >
              <div className="flex flex-col gap-3">
                <div className="text-5xl">🤖</div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                  Is Your Business Ready for<br />
                  <span className="text-green-400">AI Automation?</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-sm mx-auto">
                  8 questions. Under 2 minutes. Your answers let us skip the basics on the call and go straight to what matters for your business.
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-400 text-black font-black px-8 py-4 rounded-xl transition-colors text-base tracking-wide"
              >
                Start the Audit →
              </button>
              <p className="text-gray-700 text-xs">
                Powered by Claude AI · Built by Tommy Richardson
              </p>
            </motion.div>
          )}

          {/* QUIZ */}
          {appState === 'quiz' && currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-6"
            >
              <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />
              <QuizQuestion
                question={currentQuestion}
                selected={currentAnswer}
                onSelect={handleAnswer}
                onNext={advanceQuiz}
                onBack={handleBack}
                showBack={currentQ > 0}
              />
            </motion.div>
          )}

          {/* OPEN TEXT */}
          {appState === 'opentext' && (
            <motion.div
              key="opentext"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="w-full flex flex-col gap-6"
            >
              <ProgressBar current={QUESTIONS.length} total={QUESTIONS.length} />
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Is there a specific task or process you already want automated?
              </h2>
              <p className="text-gray-500 text-sm -mt-3">
                Describe it briefly and Tommy will come to the call prepared to address it directly.
              </p>
              <textarea
                value={openText}
                onChange={e => setOpenText(e.target.value)}
                placeholder="e.g. I want to stop manually sending invoices every month…"
                maxLength={500}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 transition-colors text-sm resize-none"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => submitAudit(openText)}
                  className="bg-green-500 hover:bg-green-400 text-black font-black px-6 py-3 rounded-xl transition-colors text-sm tracking-wide"
                >
                  Generate My Report →
                </button>
                <button
                  onClick={() => submitAudit()}
                  className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Skip this question
                </button>
              </div>
              <button onClick={handleBack} className="text-gray-600 hover:text-gray-400 text-sm transition-colors self-start">
                ← Back
              </button>
            </motion.div>
          )}

          {/* LOADING */}
          {appState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <LoadingScreen />
            </motion.div>
          )}

          {/* ERROR */}
          {appState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div className="text-4xl">😬</div>
              <p className="text-gray-300 text-lg">{error}</p>
              <button
                onClick={handleReset}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* RESULT */}
          {appState === 'result' && report && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="text-center flex flex-col gap-1">
                <p className="text-gray-500 text-xs uppercase tracking-widest">Your Automation Report</p>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-black text-white leading-tight"
                >
                  {report.headline}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-sm"
                >
                  {report.subline}
                </motion.p>
              </div>

              <ReadinessGauge score={report.score} />

              <div className="w-full border-t border-gray-800" />

              <div className="w-full">
                <h3 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">
                  Your Top Automation Opportunities
                </h3>
                <motion.div
                  className="flex flex-col gap-3"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
                  }}
                >
                  {report.opportunities.map((opp, i) => (
                    <motion.div
                      key={i}
                      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.4 }}
                    >
                      <OpportunityCard opportunity={opp} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="w-full border-t border-gray-800" />

              <CTABlock />

              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
              >
                ← Start over
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <footer className="border-t border-gray-900 py-6 px-4 text-center">
        <p className="text-gray-600 text-xs leading-relaxed">
          Built by a human using Claude AI. The irony is not lost on us.
          <br />
          <span className="text-gray-700">
            For automation &amp; workflow work →{' '}
            <a
              href="https://www.upwork.com/freelancers/tommyrichardson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-800 hover:text-green-600 underline transition-colors"
            >
              Tommy Richardson on Upwork
            </a>
          </span>
        </p>
      </footer>
    </main>
  )
}
