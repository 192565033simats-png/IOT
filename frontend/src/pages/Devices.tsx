import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import type { Device } from '../types'
import { fetchDevices } from '../services/deviceService'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'

const rowsPerPageOptions = [8, 12, 20]

function getRiskClass(score: number) {
  if (score <= 30) return 'bg-emerald-50 text-emerald-700'
  if (score <= 70) return 'bg-amber-50 text-amber-800'
  return 'bg-rose-50 text-rose-700'
}

export default function Devices() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<'deviceName' | 'riskScore' | 'status'>('deviceName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [perPage, setPerPage] = useState(12)
  const [page, setPage] = useState(1)

  const query = useQuery<Device[]>({ queryKey: ['devices'], queryFn: fetchDevices })
  const devices = query.data ?? []

  const filtered = useMemo(() => {
    return devices
      .filter((device) => {
        const normalized = search.toLowerCase()
        const matchSearch =
          device.deviceName.toLowerCase().includes(normalized) ||
          device.deviceType.toLowerCase().includes(normalized) ||
          device.status.toLowerCase().includes(normalized)
        const matchStatus = statusFilter === 'All' || device.status === statusFilter
        return matchSearch && matchStatus
      })
      .sort((a, b) => {
        const order = sortDirection === 'asc' ? 1 : -1
        if (sortKey === 'riskScore') {
          return (a.riskScore - b.riskScore) * order
        }
        return a[sortKey].toString().localeCompare(b[sortKey].toString()) * order
      })
  }, [devices, search, statusFilter, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  if (query.isLoading) return <LoadingState />
  if (query.isError)
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <p className="font-semibold">Unable to load devices.</p>
        <p className="mt-2 text-sm">Confirm the backend is running and try again.</p>
      </div>
    )

  if (!devices.length) {
    return <EmptyState title="No devices found" description="There are no devices registered in the system yet." />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Devices</h2>
            <p className="mt-1 text-sm text-slate-500">Manage device inventory, risk scores, and current status.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-xs text-slate-500 sm:w-auto">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search devices"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value)
                setPage(1)
              }}
              className="rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              <option>All</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Disconnected</option>
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
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 cursor-pointer" onClick={() => {
                  setSortKey('riskScore')
                  setSortDirection(sortKey === 'riskScore' && sortDirection === 'asc' ? 'desc' : 'asc')
                }}>
                  <div className="flex items-center gap-2">Risk Score {sortKey === 'riskScore' ? (sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />) : null}</div>
                </th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginated.map((device) => (
                <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 text-slate-900">{device.deviceName}</td>
                  <td className="px-6 py-5 text-slate-600">{device.deviceType}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskClass(device.riskScore)}`}>
                      {device.riskScore}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">Showing {paginated.length} of {filtered.length} devices</div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={perPage}
              onChange={(event) => {
                setPerPage(Number(event.target.value))
                setPage(1)
              }}
              className="rounded-2xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 outline-none"
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option}>{option} / page</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
