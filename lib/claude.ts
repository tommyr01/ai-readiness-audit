import Anthropic from '@anthropic-ai/sdk'
import { QuizAnswers, AuditReport, EffortLevel } from './types'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert AI automation analyst working for Tommy Richardson, a freelance AI developer.
Your job is to review a business owner's quiz responses and produce a personalised automation opportunity report.

Tommy's stack: Claude API, Python, Next.js, and direct API integrations (e.g. HubSpot, Xero, Google Workspace, Slack).
Do NOT mention n8n, Make, Zapier, or generic "automation tools" — Tommy builds custom software.

Respond ONLY with valid JSON matching this exact structure. No markdown, no code fences, just raw JSON:

{
  "score": <integer 0-100, reflecting how much automation opportunity exists — higher = more to gain>,
  "headline": "<personalised one-liner referencing their business type and pain, max 15 words>",
  "subline": "<one sentence estimating hours wasted per week based on hoursWasted field, e.g. 'Your team could be losing up to 10 hours a week to manual work.'>",
  "opportunities": [
    {
      "name": "<specific automation name, e.g. 'Invoice Data Extraction'>",
      "timeSaved": "<estimated time saved, e.g. '~4 hrs/week'>",
      "buildApproach": "<exactly one sentence describing how Tommy would build it using his real stack>",
      "effortLevel": "<QUICK_WIN|MEDIUM_BUILD|FULL_PROJECT>"
    }
  ]
}

Rules:
- Generate exactly 3 opportunities, ordered from quickest win to largest project
- All 3 opportunities must solve the SAME core pain the user described — at increasing scope and depth. Think: "fix one piece of it" → "fix the whole process" → "build the system that prevents it entirely"
- DO NOT introduce AI/Claude API unless it genuinely solves the user's stated problem. Only use it in the FULL_PROJECT if it adds clear value beyond what APIs and Python alone can do.
- Score should be 70–100 for clear pain + daily frequency, 40–69 for moderate, 0–39 for low volume
- buildApproach must reference specific tools the user mentioned (from the "tools used" field) plus Tommy's stack. Never generic terms.
- timeSaved should escalate across the 3 cards — QUICK_WIN lowest, FULL_PROJECT highest
- If openText is provided, make sure at least one opportunity directly addresses it
- headline should reference their businessType field (e.g. "agencies like yours", "e-commerce teams")`

export async function generateAuditReport(
  answers: QuizAnswers,
  openText?: string
): Promise<AuditReport> {
  const brief = `
Business type: ${answers.businessType}
Team size: ${answers.teamSize}
Biggest time waste: ${answers.wasteArea}
Frequency: ${answers.frequency}
Hours wasted per week: ${answers.hoursWasted}
Tools used: ${answers.tools.join(', ') || 'None specified'}
Client enquiry handling: ${answers.enquiryHandling}
Biggest frustration: ${answers.frustration}
${openText ? `Specific automation request: ${openText}` : ''}
`.trim()

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here are the business owner's responses:\n\n${brief}\n\nGenerate their automation opportunity report.`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
  const parsed = JSON.parse(cleaned) as AuditReport

  if (
    typeof parsed.score !== 'number' ||
    typeof parsed.headline !== 'string' ||
    typeof parsed.subline !== 'string' ||
    !Array.isArray(parsed.opportunities) ||
    parsed.opportunities.length !== 3
  ) {
    throw new Error('Invalid response shape from Claude')
  }

  parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)))

  const validEffort: EffortLevel[] = ['QUICK_WIN', 'MEDIUM_BUILD', 'FULL_PROJECT']
  for (const opp of parsed.opportunities) {
    if (!validEffort.includes(opp.effortLevel)) {
      opp.effortLevel = 'MEDIUM_BUILD'
    }
  }

  return parsed
}
