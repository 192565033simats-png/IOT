import { api } from './api'
import type { FirewallLog } from '../types'

export async function fetchFirewallLogs() {
  const response = await api.get<FirewallLog[]>('/firewall-logs')
  return response.data
}
