export interface Device {
  id: number
  deviceName: string
  deviceType: string
  status: string
  riskScore: number
}

export type DeviceStatus = 'Online' | 'Offline' | 'Disconnected' | string
