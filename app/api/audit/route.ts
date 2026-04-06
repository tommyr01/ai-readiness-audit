import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { generateAuditReport } from '@/lib/claude'
import { QuizAnswers } from '@/lib/types'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "You've submitted a few audits recently. Try again in a minute." },
      { status: 429 }
    )
  }

  let answers: QuizAnswers
  let openText: string | undefined

  try {
    const body = await req.json()
    answers = body.answers as QuizAnswers
    openText = typeof body.openText === 'string' ? body.openText.trim() : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Validate required fields
  const required: (keyof QuizAnswers)[] = [
    'wasteArea', 'frequency', 'businessType', 'teamSize',
    'tools', 'enquiryHandling', 'hoursWasted', 'frustration',
  ]
  for (const field of required) {
    if (!answers[field] || (Array.isArray(answers[field]) && (answers[field] as string[]).length === 0)) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 })
    }
  }

  try {
    const result = await generateAuditReport(answers, openText || undefined)
    return NextResponse.json(result)
  } catch (err) {
    console.error('Claude API error:', err)
    return NextResponse.json(
      { error: 'Something went wrong generating your report. Try again.' },
      { status: 500 }
    )
  }
}
