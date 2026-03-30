export interface ConveyorLine {
  id: string
  name: string
  status: 'active' | 'alarm' | 'idle' | 'offline'
  speed: number
  load: number
  cameraCount: number
  alertsLastHour: number
}

export interface DetectionEvent {
  id: string
  lineId: string
  cameraId: string
  timestamp: string
  type: 'waste_rock' | 'anomaly'
  confidence: number
  bbox: {
    x: number
    y: number
    w: number
    h: number
  }
  snapshotUrl: string
}

export interface Incident {
  id: string
  eventId: string
  lineId: string
  status: 'open' | 'in_progress' | 'resolved'
  assignee: string | null
  comment: string | null
  createdAt: string
  statusHistory: Array<{
    status: string
    changedAt: string
    comment?: string
  }>
}

export interface ShiftReport {
  date: string
  shift: 'morning' | 'day' | 'night'
  totalEvents: number
  criticalEvents: number
  avgResponseMinutes: number
  byHour: Array<{
    hour: number
    count: number
  }>
  byLine: Array<{
    lineId: string
    lineName: string
    count: number
  }>
}
