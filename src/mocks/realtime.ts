type LineStatus = 'active' | 'alarm' | 'idle' | 'offline'

export type LineEvent = {
  type: 'line_update' | 'critical'
  lineId: string
  status: LineStatus
  speed: number
  load: number
  message: string
}

const statuses: LineStatus[] = ['active', 'alarm', 'idle', 'offline']

const randomItem = <T,>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)]

const randomInRange = (min: number, max: number) =>
  Math.round((min + Math.random() * (max - min)) * 10) / 10

export const startMockLineEvents = (
  lineIds: string[],
  onEvent: (event: LineEvent) => void,
) => {
  if (!lineIds.length) {
    return () => undefined
  }

  const intervalId = window.setInterval(() => {
    const lineId = randomItem(lineIds)
    const status = randomItem(statuses)
    const speed = status === 'active' ? randomInRange(1.2, 3.4) : 0
    const load = status === 'active' ? Math.floor(40 + Math.random() * 50) : 0

    const isCritical = status === 'alarm' || status === 'offline'
    const message = isCritical
      ? `Критическое событие на линии ${lineId}`
      : `Обновление линии ${lineId}`

    onEvent({
      type: isCritical ? 'critical' : 'line_update',
      lineId,
      status,
      speed,
      load,
      message,
    })
  }, 5000)

  return () => {
    window.clearInterval(intervalId)
  }
}
