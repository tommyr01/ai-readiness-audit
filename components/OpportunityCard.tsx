import { Opportunity, EffortLevel } from '@/lib/types'

const effortConfig: Record<EffortLevel, { label: string; bg: string; border: string; badge: string }> = {
  QUICK_WIN: {
    label: 'QUICK WIN',
    bg: 'bg-green-950',
    border: 'border-green-800',
    badge: 'bg-green-900 text-green-400',
  },
  MEDIUM_BUILD: {
    label: 'MEDIUM BUILD',
    bg: 'bg-amber-950',
    border: 'border-amber-800',
    badge: 'bg-amber-900 text-amber-400',
  },
  FULL_PROJECT: {
    label: 'FULL PROJECT',
    bg: 'bg-red-950',
    border: 'border-red-900',
    badge: 'bg-red-900 text-red-400',
  },
}

export default function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const cfg = effortConfig[opportunity.effortLevel]
  return (
    <div className={`rounded-xl border ${cfg.bg} ${cfg.border} p-4 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-white font-semibold text-sm leading-snug">{opportunity.name}</span>
        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-green-400 font-bold text-sm">{opportunity.timeSaved}</span>
        <span className="text-gray-600 text-xs">saved per week</span>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{opportunity.buildApproach}</p>
    </div>
  )
}
