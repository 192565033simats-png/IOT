import { api } from './api'
import type { SandboxSession } from '../types'

export async function fetchSandboxSessions() {
  const response = await api.get<SandboxSession[]>('/sandbox-sessions')
  return response.data
}
