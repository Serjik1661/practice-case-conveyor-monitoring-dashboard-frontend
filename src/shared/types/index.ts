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
    byLine: Array <{
        lineId: string
        lineName: string
        count: number
    }>
}
