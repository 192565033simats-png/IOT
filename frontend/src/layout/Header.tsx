import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/devices': 'Devices',
  '/firewall-logs': 'Firewall Logs',
  '/sandbox-sessions': 'Sandbox Sessions',
}

export default function Header() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Dashboard'

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          Alerts
        </button>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">SH</div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Security Analyst</p>
            <p className="text-xs text-slate-500">Live status</p>
          </div>
        </div>
      </div>
    </header>
  )
}
