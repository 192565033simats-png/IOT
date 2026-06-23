import { api } from './api'
import type { Device } from '../types'

export async function fetchDevices() {
  const response = await api.get<Device[]>('/devices')
  return response.data
}
