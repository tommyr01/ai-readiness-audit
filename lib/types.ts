export type EffortLevel = 'QUICK_WIN' | 'MEDIUM_BUILD' | 'FULL_PROJECT'

export interface QuizAnswers {
  wasteArea: string
  frequency: string
  businessType: string
  teamSize: string
  tools: string[]
  enquiryHandling: string
  hoursWasted: string
  frustration: string
}

export interface Opportunity {
  name: string
  timeSaved: string
  buildApproach: string
  effortLevel: EffortLevel
}

export interface AuditReport {
  score: number        // 0–100
  headline: string
  subline: string
  opportunities: Opportunity[]
}
