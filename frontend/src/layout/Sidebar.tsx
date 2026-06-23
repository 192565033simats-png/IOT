import { NavLink } from 'react-router-dom'
import {
  Cpu,
  ShieldAlert,
  LayoutDashboard,
  FileText,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Devices', path: '/devices', icon: Cpu },
  { label: 'Firewall Logs', path: '/firewall-logs', icon: ShieldAlert },
  { label: 'Sandbox Sessions', path: '/sandbox-sessions', icon: FileText },
]

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Secure home</p>
          <p className="text-base font-semibold text-slate-900">SmartHome Firewall</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Real-time monitoring</p>
        <p className="mt-2 leading-6">Connected to your local firewall API at <span className="font-medium text-slate-700">localhost:8080</span>.</p>
      </div>
    </aside>
  )
}
