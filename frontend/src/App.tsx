import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import FirewallLogs from './pages/FirewallLogs'
import SandboxSessions from './pages/SandboxSessions'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="devices" element={<Devices />} />
          <Route path="firewall-logs" element={<FirewallLogs />} />
          <Route path="sandbox-sessions" element={<SandboxSessions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
