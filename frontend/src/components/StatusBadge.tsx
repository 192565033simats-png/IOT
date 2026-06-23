import { cn } from '../utils/classNames'

interface StatusBadgeProps {
  status: string
}

const palette: Record<string, string> = {
  online: 'bg-emerald-50 text-emerald-700',
  offline: 'bg-slate-50 text-slate-700',
  disconnected: 'bg-slate-50 text-slate-700',
  running: 'bg-sky-50 text-sky-700',
  completed: 'bg-emerald-50 text-emerald-700',
  blocked: 'bg-amber-50 text-amber-800',
  failed: 'bg-rose-50 text-rose-700',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const colorClass = palette[key] ?? 'bg-slate-50 text-slate-700'
  return (
    <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', colorClass)}>
      {status}
    </span>
  )
}
