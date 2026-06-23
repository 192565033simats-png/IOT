export interface FirewallLog {
  id: number
  deviceName: string
  action: string
  sourceIp: string
  destinationIp: string
  timestamp: string
}
