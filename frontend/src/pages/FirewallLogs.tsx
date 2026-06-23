import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { fetchFirewallLogs } from '../services/firewallService'
import type { FirewallLog } from '../types'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'

const actionColors: Record<string, string> = {
  allowed: 'bg-emerald-50 text-emerald-700',
  blocked: 'bg-rose-50 text-rose-700',
  alert: 'bg-amber-50 text-amber-800',
}

function getActionClass(action: string) {
  return actionColors[action.toLowerCase()] ?? 'bg-slate-50 text-slate-700'
}

export default function FirewallLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('All')

  const query = useQuery<FirewallLog[]>({ queryKey: ['firewallLogs'], queryFn: fetchFirewallLogs })
  const logs = query.data ?? []

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const normalized = search.toLowerCase()
      const matchSearch =
        log.deviceName.toLowerCase().includes(normalized) ||
        log.sourceIp.toLowerCase().includes(normalized) ||
        log.destinationIp.toLowerCase().includes(normalized)
      const matchAction = actionFilter === 'All' || log.action === actionFilter
      return matchSearch && matchAction
    })
  }, [logs, search, actionFilter])

  if (query.isLoading) return <LoadingState />
  if (query.isError)
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <p className="font-semibold">Unable to load firewall logs.</p>
        <p className="mt-2 text-sm">Confirm the backend is running and try again.</p>
      </div>
    )

  if (!logs.length) {
    return <EmptyState title="No firewall activity" description="The firewall has not captured any events yet." />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Firewall Logs</h2>
            <p className="mt-1 text-sm text-slate-500">View all firewall actions and review traffic patterns.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs text-slate-500 sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search logs"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              <option>All</option>
              <option>Allowed</option>
              <option>Blocked</option>
              <option>Alert</option>
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
                <th className="px-6 py-4">Source IP</th>
                <th className="px-6 py-4">Destination IP</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 text-slate-900">{log.deviceName}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getActionClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-600">{log.sourceIp}</td>
                  <td className="px-6 py-5 text-slate-600">{log.destinationIp}</td>
                  <td className="px-6 py-5 text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
