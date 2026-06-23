import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Device, FirewallLog } from '../types'
import {
  Pie,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  LineChart,
  Cell,
} from 'recharts'
import { ShieldCheck, Cpu, AlertTriangle, ListChecks, CircleDashed } from 'lucide-react'
import KpiCard from '../components/KpiCard'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import { fetchDevices } from '../services/deviceService'
import { fetchFirewallLogs } from '../services/firewallService'
import { fetchSandboxSessions } from '../services/sandboxService'

const palette = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#94A3B8',
}

function buildRiskDistribution(devices: Device[]) {
  const buckets = [
    { name: 'Low risk', range: '0–30', value: 0, color: palette.success },
    { name: 'Medium risk', range: '31–70', value: 0, color: palette.warning },
    { name: 'High risk', range: '71–100', value: 0, color: palette.danger },
  ]

  devices.forEach((device) => {
    if (device.riskScore <= 30) buckets[0].value += 1
    else if (device.riskScore <= 70) buckets[1].value += 1
    else buckets[2].value += 1
  })

  return buckets
}

function buildDeviceTypeBreakdown(devices: Device[]) {
  const map = new Map<string, number>()
  devices.forEach((device) => {
    map.set(device.deviceType, (map.get(device.deviceType) ?? 0) + 1)
  })
  return Array.from(map.entries()).map(([key, value]) => ({ name: key, value }))
}

function buildTrend(logs: FirewallLog[]) {
  const map = new Map<string, number>()
  logs.forEach((log) => {
    const date = new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    map.set(date, (map.get(date) ?? 0) + 1)
  })

  return Array.from(map.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([name, value]) => ({ name, value }))
}

export default function Dashboard() {
  const devicesQuery = useQuery<Device[]>({ queryKey: ['devices'], queryFn: fetchDevices })
  const firewallQuery = useQuery<FirewallLog[]>({ queryKey: ['firewallLogs'], queryFn: fetchFirewallLogs })
  const sessionsQuery = useQuery({ queryKey: ['sandboxSessions'], queryFn: fetchSandboxSessions })

  const devices = devicesQuery.data ?? []
  const firewallLogs = firewallQuery.data ?? []
  const sessions = sessionsQuery.data ?? []

  const activeDevices = useMemo(
    () => devices.filter((device) => device.status.toLowerCase() === 'online').length,
    [devices],
  )
  const highRiskDevices = useMemo(
    () => devices.filter((device) => device.riskScore > 70).length,
    [devices],
  )
  const riskDistribution = useMemo(() => buildRiskDistribution(devices), [devices])
  const typeBreakdown = useMemo(() => buildDeviceTypeBreakdown(devices), [devices])
  const activityTrend = useMemo(() => buildTrend(firewallLogs), [firewallLogs])

  const isLoading = devicesQuery.isLoading || firewallQuery.isLoading || sessionsQuery.isLoading
  const isError = devicesQuery.isError || firewallQuery.isError || sessionsQuery.isError

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <p className="font-semibold">Unable to load dashboard data.</p>
        <p className="mt-2 text-sm">Confirm your backend is running and refresh the page.</p>
      </div>
    )
  }

  if (!devices.length && !firewallLogs.length && !sessions.length) {
    return <EmptyState title="No monitoring data available" description="There is no device or log information in the backend yet." />
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[repeat(3,minmax(0,1fr))]">
        <KpiCard title="Total Devices" value={devices.length} secondary="All registered endpoints across the network." icon={<Cpu className="h-6 w-6" />} />
        <KpiCard title="Active Devices" value={activeDevices} secondary="Devices currently reporting status updates." icon={<CircleDashed className="h-6 w-6" />} />
        <KpiCard title="High Risk Devices" value={highRiskDevices} secondary="Devices with critical risk scoring." icon={<AlertTriangle className="h-6 w-6 text-amber-700" />} />
        <KpiCard title="Firewall Events" value={firewallLogs.length} secondary="Recent connection attempts captured by the firewall." icon={<ShieldCheck className="h-6 w-6" />} />
        <KpiCard title="Sandbox Sessions" value={sessions.length} secondary="Threat behavior evaluations in the sandbox." icon={<ListChecks className="h-6 w-6" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Threat trend</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Firewall activity</h2>
            </div>
          </div>
          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrend} margin={{ top: 20, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="value" stroke={palette.primary} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Risk distribution</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Device risk profile</h2>
            <div className="mt-6 space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.range}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Device inventory</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Type breakdown</h2>
            <div className="mt-6 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={90} paddingAngle={2} stroke="transparent">
                    {typeBreakdown.map((entry, index) => (
                      <Cell key={`slice-${entry.name}`} fill={['#2563EB', '#10B981', '#F59E0B', '#6366F1', '#64748B'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
