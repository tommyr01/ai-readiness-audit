import type { QuizAnswers } from './types'

export type QuestionType = 'single' | 'multi'

export interface QuizQuestion {
  id: keyof QuizAnswers
  question: string
  type: QuestionType
  options: string[]
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'wasteArea',
    question: 'Where does your team waste the most time?',
    type: 'single',
    options: [
      'Manual data entry & admin',
      'Chasing clients / follow-ups',
      'Scheduling & coordination',
      'Repetitive reporting & spreadsheets',
      'Sorting & responding to emails',
    ],
  },
  {
    id: 'frequency',
    question: 'How often does this happen?',
    type: 'single',
    options: ['Daily', 'A few times a week', 'Weekly', 'Monthly'],
  },
  {
    id: 'businessType',
    question: 'What kind of business do you run?',
    type: 'single',
    options: [
      'Agency / consultancy',
      'E-commerce / retail',
      'Professional services (legal, finance, HR)',
      'SaaS / tech company',
      'Other',
    ],
  },
  {
    id: 'teamSize',
    question: 'How many people are on your team?',
    type: 'single',
    options: ['Just me', '2–5', '6–20', '20+'],
  },
  {
    id: 'tools',
    question: 'Which tools does your team already use?',
    type: 'multi',
    options: [
      'Google Workspace',
      'Slack',
      'HubSpot / CRM',
      'Notion / Airtable',
      'Xero / QuickBooks',
    ],
  },
  {
    id: 'enquiryHandling',
    question: 'How do you currently handle client enquiries?',
    type: 'single',
    options: [
      'Manually by email',
      'Help desk tool (Intercom, Zendesk, etc.)',
      'Mostly phone',
      'No formal process',
    ],
  },
  {
    id: 'hoursWasted',
    question: 'How many hours a week does your team spend on these tasks?',
    type: 'single',
    options: ['Under 2 hrs', '2–5 hrs', '5–10 hrs', '10+ hrs'],
  },
  {
    id: 'frustration',
    question: "What's your biggest frustration right now?",
    type: 'single',
    options: [
      'Growing too fast to keep up manually',
      'Too many mistakes in repetitive work',
      'Costs are too high',
      "Clients aren't getting a great experience",
    ],
  },
]
