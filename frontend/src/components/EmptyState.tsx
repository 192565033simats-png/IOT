import { MessageSquare } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <MessageSquare className="h-5 w-5" />
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  )
}
