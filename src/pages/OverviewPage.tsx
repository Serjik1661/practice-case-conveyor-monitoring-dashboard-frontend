import type { ConveyorLine } from '../shared/types'
import { conveyorLines } from '../mocks/fixtures'
import { useSearchParams } from 'react-router-dom'

type FilterStatus = 'all' | ConveyorLine['status']

const statusLabels: Record<ConveyorLine['status'], string> = {
  active: 'Работает',
  alarm: 'Тревога',
  idle: 'Ожидание',
  offline: 'Оффлайн',
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
  { value: 'offline', label: 'Оффлайн' },
]

function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams()

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
      ? conveyorLines
      : conveyorLines.filter((line) => line.status === selectedStatus)

  const handleFilterChange = (status: FilterStatus) => {
    if (status === 'all') {
      setSearchParams({})
      return
    }

    setSearchParams({ status })
  }

  return (
    <div>
      <h2>Обзор</h2>
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
    </div>
  )
}

export default OverviewPage
