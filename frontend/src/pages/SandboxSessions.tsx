import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { fetchSandboxSessions } from '../services/sandboxService'
import type { SandboxSession } from '../types'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

export default function SandboxSessions() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const query = useQuery<SandboxSession[]>({ queryKey: ['sandboxSessions'], queryFn: fetchSandboxSessions })
  const sessions = query.data ?? []

  const filtered = useMemo(() => {
    return sessions.filter((session) => {
      const normalized = search.toLowerCase()
      const matchSearch =
        session.deviceName.toLowerCase().includes(normalized) ||
        session.action.toLowerCase().includes(normalized)
      const matchStatus = statusFilter === 'All' || session.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [sessions, search, statusFilter])

  if (query.isLoading) return <LoadingState />
  if (query.isError)
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <p className="font-semibold">Unable to load sandbox sessions.</p>
        <p className="mt-2 text-sm">Confirm the backend is running and try again.</p>
      </div>
    )

  if (!sessions.length) {
    return <EmptyState title="No sandbox sessions" description="Sandbox session results will appear here when analysis runs." />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Sandbox Sessions</h2>
            <p className="mt-1 text-sm text-slate-500">Review sandbox action status and execution details.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs text-slate-500 sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sessions"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              <option>All</option>
              <option>Running</option>
              <option>Completed</option>
              <option>Blocked</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4">Device Name</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 text-slate-900">{session.deviceName}</td>
                  <td className="px-6 py-5 text-slate-600">{session.action}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-6 py-5 text-slate-600">{new Date(session.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
