import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ConveyorLine } from '../shared/types'
import { startMockLineEvents, type LineEvent } from '../mocks/realtime'

type FilterStatus = 'all' | ConveyorLine['status']

const statusLabels: Record<ConveyorLine['status'], string> = {
  active: 'Работает',
  alarm: 'Тревога',
  idle: 'Ожидание',
  offline: 'Офлайн',
}

const statusColors: Record<ConveyorLine['status'], string> = {
  active: '#22c55e',
  alarm: '#ef4444',
  idle: '#f59e0b',
  offline: '#6b7280',
}

const filterButtons: Array<{ value: FilterStatus; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Работает' },
  { value: 'alarm', label: 'Тревога' },
  { value: 'idle', label: 'Ожидание' },
  { value: 'offline', label: 'Офлайн' },
]

function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [lines, setLines] = useState<ConveyorLine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>(
    [],
  )
  const [notificationsCount, setNotificationsCount] = useState(0)

  useEffect(() => {
    const loadLines = async () => {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch('/api/lines')

        if (!response.ok) {
          throw new Error('Ошибка загрузки линий')
        }

        const data: ConveyorLine[] = await response.json()
        setLines(data)
      } catch {
        setError('Не удалось загрузить линии')
      } finally {
        setIsLoading(false)
      }
    }

    loadLines()
  }, [])

  useEffect(() => {
    if (!lines.length) {
      return
    }

    const stopEvents = startMockLineEvents(
      lines.map((line) => line.id),
      (event: LineEvent) => {
        setLines((prev) =>
          prev.map((line) =>
            line.id === event.lineId
              ? {
                  ...line,
                  status: event.status,
                  speed: event.speed,
                  load: event.load,
                  alertsLastHour:
                    event.type === 'critical'
                      ? line.alertsLastHour + 1
                      : line.alertsLastHour,
                }
              : line,
          ),
        )

        if (event.type === 'critical') {
          const toastId = Date.now() + Math.random()
          setNotificationsCount((prev) => prev + 1)
          setToasts((prev) => [...prev, { id: toastId, message: event.message }])

          window.setTimeout(() => {
            setToasts((prev) => prev.filter((item) => item.id !== toastId))
          }, 4000)
        }
      },
    )

    return () => stopEvents()
  }, [lines.length])

  const statusParam = searchParams.get('status')

  const selectedStatus: FilterStatus =
    statusParam === 'active' ||
    statusParam === 'alarm' ||
    statusParam === 'idle' ||
    statusParam === 'offline'
      ? statusParam
      : 'all'

  const filteredLines =
    selectedStatus === 'all'
      ? lines
      : lines.filter((line) => line.status === selectedStatus)

  const handleFilterChange = (status: FilterStatus) => {
    if (status === 'all') {
      setSearchParams({})
      return
    }

    setSearchParams({ status })
  }

  if (isLoading) {
    return (
      <div>
        <h2>Обзор</h2>
        <p>Загрузка линий...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>Обзор</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2>Обзор</h2>
        <span
          style={{
            background: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '12px',
          }}
        >
          Уведомления: {notificationsCount}
        </span>
      </div>
      <p>Ниже показаны тестовые конвейерные линии.</p>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        {filterButtons.map((button) => {
          const isActive = selectedStatus === button.value

          return (
            <button
              key={button.value}
              onClick={() => handleFilterChange(button.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: isActive ? '#2563eb' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {button.label}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {filteredLines.map((line) => {
          const isAlarm = line.status === 'alarm'
          const isOffline = line.status === 'offline'

          return (
            <div
              key={line.id}
              style={{
                border: isAlarm ? '1px solid #ef4444' : '1px solid #444',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                background: isAlarm
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'transparent',
                opacity: isOffline ? 0.55 : 1,
                transition: '0.2s ease',
              }}
            >
              <h3>{line.name}</h3>

              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Статус:
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: statusColors[line.status],
                      display: 'inline-block',
                    }}
                  />
                  {statusLabels[line.status]}
                </span>
              </p>

              <p>Скорость: {line.speed} м/с</p>
              <p>Нагрузка: {line.load}%</p>
              <p>Камер: {line.cameraCount}</p>
              <p>Тревог за час: {line.alertsLastHour}</p>
            </div>
          )
        })}
      </div>

      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          display: 'grid',
          gap: '8px',
          zIndex: 50,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              border: '1px solid #ef4444',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: '10px',
              minWidth: '220px',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverviewPage
