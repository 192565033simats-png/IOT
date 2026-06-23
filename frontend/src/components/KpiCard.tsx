import type { ReactNode } from 'react'

interface KpiCardProps {
  title: string
  value: string | number
  secondary?: string
  icon?: ReactNode
}

export default function KpiCard({ title, value, secondary, icon }: KpiCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        {icon ? <div className="text-slate-400">{icon}</div> : null}
      </div>
      {secondary ? <p className="mt-4 text-sm text-slate-500">{secondary}</p> : null}
    </div>
  )
}
